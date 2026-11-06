const CustomAPIError = require('../errors/custom-error')
const transporter = require('../models/mailer')
const geoip = require('geoip-lite')
const dns = require('dns').promises

const countryNames = new Intl.DisplayNames(['en'], { type: 'region' })

const getCountryName = (code) => {
    if (!code) return ''
    try {
        return countryNames.of(code.toUpperCase()) || code
    } catch (e) {
        return code
    }
}

const homeGet = async(req, res)=>{
    res.status(200).json({msg:"on the home page"})
}

const aboutGet = async (req, res)=>{
    res.status(200).send('yayayaya')
}

const isPrivateOrLocalIp = (ip) => {
    if (!ip || ip === 'Unknown IP') return true;
    if (ip === '127.0.0.1' || ip === '::1' || ip === 'localhost') return true;
    if (/^10\./.test(ip)) return true;
    if (/^172\.(1[6-9]|2[0-9]|3[0-1])\./.test(ip)) return true;
    if (/^192\.168\./.test(ip)) return true;
    if (/^169\.254\./.test(ip)) return true;
    if (/^(fc00|fd00|fe80)/i.test(ip)) return true;
    return false;
};

const getClientIp = (req) => {
    let ip = '';
    if (req.headers && req.headers['cf-connecting-ip']) {
        ip = req.headers['cf-connecting-ip'];
    } else if (req.headers && req.headers['x-forwarded-for']) {
        const forwarded = req.headers['x-forwarded-for'];
        ip = typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : forwarded[0];
    } else if (req.headers && req.headers['x-real-ip']) {
        ip = req.headers['x-real-ip'];
    } else if (req.ip) {
        ip = req.ip;
    } else if (req.socket && req.socket.remoteAddress) {
        ip = req.socket.remoteAddress;
    } else if (req.connection && req.connection.remoteAddress) {
        ip = req.connection.remoteAddress;
    }

    if (typeof ip === 'string') {
        ip = ip.trim();
        if (ip.startsWith('::ffff:')) {
            ip = ip.replace('::ffff:', '');
        }
    }

    return ip || 'Unknown IP';
};

// Offline self-resolution using local MaxMind GeoLite database and Node.js reverse DNS
const doItYourselfLookup = async (ip) => {
    try {
        const geo = geoip.lookup(ip);
        let reverseHost = '';
        try {
            const hosts = await Promise.race([
                dns.reverse(ip),
                new Promise((_, reject) => setTimeout(() => reject(new Error('timeout')), 1500))
            ]);
            if (hosts && hosts.length > 0) {
                reverseHost = hosts[0];
            }
        } catch (e) {
            // Reverse DNS can fail or timeout for certain IPs; ignore
        }

        if (!geo && !reverseHost) {
            return null;
        }

        const country = geo ? getCountryName(geo.country) : '';

        return {
            ip,
            city: geo?.city || '',
            region: geo?.region || '',
            country: country || geo?.country || '',
            countryCode: geo?.country || '',
            postal: '',
            latitude: geo?.ll ? geo.ll[0] : null,
            longitude: geo?.ll ? geo.ll[1] : null,
            isp: reverseHost || 'N/A',
            timezone: geo?.timezone || '',
            source: 'Local GeoIP Database (Self-Resolved / No API Limit)'
        };
    } catch (err) {
        console.error('Self-lookup failed:', err.message);
        return null;
    }
};

const getLocationData = async (clientIp) => {
    const isPrivate = isPrivateOrLocalIp(clientIp);
    const targetIp = (clientIp === '::1') ? '127.0.0.1' : clientIp;

    // If request is from localhost / local dev network
    if (isPrivate) {
        try {
            const response = await fetch('https://ipwho.is/', { signal: AbortSignal.timeout(3000) });
            const data = await response.json();
            if (data && data.success !== false) {
                return {
                    ip: data.ip || clientIp,
                    city: data.city || '',
                    region: data.region || '',
                    country: data.country || '',
                    countryCode: data.country_code || '',
                    postal: data.postal || '',
                    latitude: data.latitude,
                    longitude: data.longitude,
                    isp: data.connection?.isp || data.connection?.org || '',
                    timezone: data.timezone?.id || '',
                    isDevLocal: true,
                    source: 'ipwho.is (Host Public IP)'
                };
            }
        } catch (err) {
            // Local dev fallback when offline
            return {
                ip: clientIp,
                city: 'Localhost',
                region: 'Local Network',
                country: 'Development Machine',
                countryCode: '',
                postal: '',
                latitude: null,
                longitude: null,
                isp: 'Localhost / Internal',
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone || '',
                isDevLocal: true,
                source: 'Local Environment'
            };
        }
    }

    // 1. Try primary external API (ipwho.is)
    try {
        const response = await fetch(`https://ipwho.is/${encodeURIComponent(targetIp)}`, { signal: AbortSignal.timeout(3000) });
        const data = await response.json();
        if (data && data.success !== false) {
            return {
                ip: data.ip || clientIp,
                city: data.city || '',
                region: data.region || '',
                country: data.country || '',
                countryCode: data.country_code || '',
                postal: data.postal || '',
                latitude: data.latitude,
                longitude: data.longitude,
                isp: data.connection?.isp || data.connection?.org || '',
                timezone: data.timezone?.id || '',
                isDevLocal: false,
                source: 'ipwho.is'
            };
        }
    } catch (err) {
        console.warn('ipwho.is failed or rate-limited, trying fallback...');
    }

    // 2. Try secondary external API (freeipapi.com)
    try {
        const fallbackUrl = `https://freeipapi.com/api/json/${encodeURIComponent(targetIp)}`;
        const response = await fetch(fallbackUrl, { signal: AbortSignal.timeout(3000) });
        const data = await response.json();
        if (data && data.cityName) {
            return {
                ip: data.ipAddress || clientIp,
                city: data.cityName || '',
                region: data.regionName || '',
                country: data.countryName || '',
                countryCode: data.countryCode || '',
                postal: data.zipCode || '',
                latitude: data.latitude,
                longitude: data.longitude,
                isp: data.asnOrganization || '',
                timezone: data.timeZones?.[0] || '',
                isDevLocal: false,
                source: 'freeipapi.com'
            };
        }
    } catch (err) {
        console.warn('freeipapi.com failed or rate-limited...');
    }

    // 3. DO IT YOURSELF: Local GeoIP database (geoip-lite) + Reverse DNS lookup
    // Never rate-limited, no external HTTP calls required
    console.log(`External APIs failed or rate-limited. Self-resolving IP ${targetIp} locally...`);
    const selfResult = await doItYourselfLookup(targetIp);
    if (selfResult) {
        return {
            ...selfResult,
            isDevLocal: false
        };
    }

    return null;
};

const sendContact = async(req, res)=>{
    try {
        const { email, subject, message } = req.body || {};

        const clientIp = getClientIp(req);
        const locationData = await getLocationData(clientIp);

        let ipDisplay = clientIp;
        let formattedLocation = 'Location unavailable';
        let mapLink = '';

        if (locationData) {
            const locationParts = [locationData.city, locationData.region, locationData.country].filter(Boolean);
            formattedLocation = locationParts.join(', ') || 'Unknown Location';
            if (locationData.postal) {
                formattedLocation += ` (${locationData.postal})`;
            }

            if (locationData.latitude && locationData.longitude) {
                mapLink = `https://www.google.com/maps?q=${locationData.latitude},${locationData.longitude}`;
            }

            if (locationData.isDevLocal) {
                ipDisplay = `${clientIp} (Local Dev / Host Public IP: ${locationData.ip})`;
            }
        }

        const mailText = [
            `From: ${email}`,
            `Subject: ${subject || 'No Subject'}`,
            '',
            'Message:',
            message,
            '',
            '--------------------------------------------------',
            'Sender Details:',
            `IP Address: ${ipDisplay}`,
            `Location: ${formattedLocation}`,
            locationData?.isp ? `ISP / Host: ${locationData.isp}` : null,
            locationData?.timezone ? `Timezone: ${locationData.timezone}` : null,
            mapLink ? `Google Maps: ${mapLink}` : null,
            locationData?.source ? `Lookup Source: ${locationData.source}` : null,
            '--------------------------------------------------'
        ].filter(line => line !== null).join('\n');

        const mailHtml = `
            <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <h2 style="color: #2c3e50; border-bottom: 2px solid #eee; padding-bottom: 8px;">New Contact Form Message</h2>
                <p><strong>From:</strong> <a href="mailto:${email}">${email}</a></p>
                <p><strong>Subject:</strong> ${subject || 'No Subject'}</p>
                
                <div style="background-color: #f8f9fa; border-left: 4px solid #3498db; padding: 12px 16px; margin: 20px 0; border-radius: 4px;">
                    <h3 style="margin-top: 0; color: #2c3e50;">Message:</h3>
                    <p style="white-space: pre-wrap; margin: 0; color: #555;">${message || '(No message provided)'}</p>
                </div>

                <div style="background-color: #eef2f7; padding: 16px; border-radius: 6px; margin-top: 20px;">
                    <h3 style="margin-top: 0; color: #34495e;">Sender Information</h3>
                    <p style="margin: 4px 0;"><strong>IP Address:</strong> ${ipDisplay}</p>
                    <p style="margin: 4px 0;"><strong>Location:</strong> ${formattedLocation}</p>
                    ${locationData?.isp ? `<p style="margin: 4px 0;"><strong>ISP / Host:</strong> ${locationData.isp}</p>` : ''}
                    ${locationData?.timezone ? `<p style="margin: 4px 0;"><strong>Timezone:</strong> ${locationData.timezone}</p>` : ''}
                    ${mapLink ? `<p style="margin: 4px 0;"><strong>Map:</strong> <a href="${mapLink}" target="_blank">View on Google Maps</a></p>` : ''}
                    ${locationData?.source ? `<p style="margin: 4px 0; font-size: 12px; color: #7f8c8d;"><strong>Source:</strong> ${locationData.source}</p>` : ''}
                </div>
            </div>
        `;

        await transporter.sendMail({
            from: 'tmrun.mail.co@gmail.com',
            to: email === "JENN@gmail.com" ? "jennierlay@gmail.com" : 'shadman.sohel04@gmail.com',
            subject: subject || 'New Contact Form Submission',
            text: mailText,
            html: mailHtml,
        });

        console.log('Contact email sent successfully');
        res.status(200).send({success: true});
    } catch (error) {
        console.error('Error in sendContact:', error);
        res.status(200).send({success: false});
    }
}

module.exports = {
    homeGet,
    aboutGet,
    sendContact
}
