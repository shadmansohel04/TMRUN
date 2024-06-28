const User = require('./backend/models/user')

async function maker(username, password, email){
    try {
        const hashedPassword = await encryptPassword(password); 
        await User.create({
            username: username,
            password: hashedPassword,
            email: email
        });

    } catch (error) {
        console.log(error)
    }

}
