import '../styles/aboutBody.css'
import stravaLogo from '../assets/stravaLogo.webp'
import leaderboard from '../assets/leaderboard.png'

export default function aboutBody(){
    return(
        <div className="aboutBody">
            <div className='motivationBlurb'>
                <div className='leftMotivationBlurb'>
                    <h1 className='aboutTitle'>ABOUT</h1>
                    <p>Finding motivation can be tough, especially when social media bombards us with 
                    unrealistic standards and exceptionally fast run times. It's important to 
                    remember that comparing yourself to others can be discouraging and unfair. 
                    Instead, focus on connecting with people who share similar goals and experiences. 
                    Community support can keep you motivated and consistent, especially when it comes 
                    from a close-knit group. Make friends, join a running club, or use TMRUN to track 
                    your progress using our metrics. Just sign in with your Strava account, 
                    and we'll take care of the rest.
                    </p>
                </div>
                <img src={stravaLogo} alt="strava logo" className='stravaLogo'/>
            </div>

            <div className='motivationBlurb topMargin'>
                <div className='leftMotivationBlurb'>
                    <h1 className='aboutTitle'>RANKING</h1>
                    <p>Our scores are nuanced and vary in criteria and distance. With a minimum distace of 2km,
                        the criteria ranges between speed, consistency and your route. We believe that running 
                        metrics should be complicated and not bottled down to a single value. 
                        We host scores for 2km, 5km, 10km and 20k, with the option to join the leaderboards.
                         Ready to lace them up yet?
                    </p>
                </div>
                <img src={leaderboard} alt="time/calender" className='stravaLogo dunnowhyitdont'/>
            </div>
        </div>
    )
}