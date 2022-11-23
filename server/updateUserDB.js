const {User} = require('./models');
const mongoose = require('mongoose')
const config = require("./config/config")


async function main(){
    await mongoose.connect(config.url, { dbName: 'data' }).then(() => {
        console.log('Connected to MongoDB');
    })
    
    const users = await User.find({})
    
    for (const user of users) {
        const role = user.role
        await User.findByIdAndUpdate(user._id, { roles: [role] })
        await User.findByIdAndUpdate(user._id, { $unset: {role: 1} })
    }    

    console.log('Success');
    return false
}

main()