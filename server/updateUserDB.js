const {Group, Member} = require('./models');
const mongoose = require('mongoose')
const config = require("./config/config")


async function main(){
    await mongoose.connect(config.url, { dbName: 'data' }).then(() => {
        console.log('Connected to MongoDB');
    })
    
    const groups = Group.find({})

    let members = []

    for(const group of groups){
        for(const participant of group.participants){
            members.push({
                firstname: participant.firstname,
                lastname: participant.lastname,
                birthday: participant.birthday,
                departments: [group.departments],
                groups: [group._id]
            })
        }
    }

    

    console.log('Success');
    return false
}

main()