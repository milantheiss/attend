const {Group, Member} = require('./models');
const mongoose = require('mongoose')
const config = require("./config/config")


async function main(){
    await mongoose.connect(config.url, { dbName: 'data' }).then(() => {
        console.log('Connected to MongoDB');
    })
    
    const groups = await Group.find({})

    for(const group of groups){
        for(const participant of group.participants){
            Member.create({
                firstname: participant.firstname,
                lastname: participant.lastname,
                birthday: participant.birthday,
                departments: [group.department._id],
                groups: [group._id]
            })
        }
    }    

    console.log('Success');
    return false
}

main()