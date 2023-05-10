const httpStatus = require('http-status');
const { default: mongoose } = require('mongoose');
const { Member, Issue, Group, User } = require('../models');
const ApiError = require('../utils/ApiError');


//Service updated/zieht die Daten aus DB

/**
 * Get all members.
 * @returns {Promise<[Member]>}
 */
const getMembers = async () => {
    return Member.find({});
};

/**
 * Get a group by ID.
 * @param {ObjectId} id
 * @returns {Promise<Member>}
 */
const getMemberById = async (id) => {
    return Member.findById(id);
};

/**
 * Handels Event which is triggered if a member is added to a group. (Member must not be completely new in DB)
 * WARNING No Access Control: Must be handle from the caller.
 * @param {User} user 
 * @param {Group} group 
 * @param {Object} memberBody 
 * @returns 
 */
const handleNewMemberEvent = async (user, group, memberBody) => {
    //Sucht nach Membern mit dem gleichen Namen und Geburtsdatum
    const members = await Member.find({
        $and: [
            { lastname: memberBody.lastname },
            { firstname: memberBody.firstname },
            { birthday: memberBody.birthday }
        ]
    })

    /*
    Wenn keine gleichen Member gefunden wurden, heißt ein neuer Member hinzugefügt wurde. 
    Wird der Member in der DB angelegt, damit die Daten abgespeichert sind, jedoch wird ein Issue erstellt, damit ein Sachbearbeiter den User verifizieren kann.
    */
    if (members.length === 0) {
        //Der neue Member wird erstellt

        memberBody = {
            ...memberBody,
            departments: [group.department],
            groups: [group._id],
            openIssues: [new mongoose.Types.ObjectId()]
        }

        const newMember = await Member.create(memberBody);

        await Issue.create({
            _id: newMember.openIssues[0],
            tag: 'newMember',
            date: new Date(),
            body: {
                groupID: group._id,
                memberID: newID,
                createdBy: user._id,
                firstname: newMember.firstname,
                lastname: newMember.lastname,
                birthday: newMember.birthday,
                department: group.department
            }
        })

        newMember.memberId = newMember._id

        return newMember
    } else {
        //Wenn es mehrere Member mit dem gleichen Namen und Geburtsdatum in der DB existieren, wird ein Issue erstellt, dass dies von einem Sachbearbeiter geprüft werden muss.    
        //TODO Hier sollte eine Whitelist hinzugefügt werden, sodass diese Member ignoriert werden, sollte die Dopplung kein Fehler sein.
        if (members.length > 1) {
            const issue = await Issue.create({
                tag: "duplicateMemberInDB",
                date: new Date(),
                body: {
                    memberIDs: members.map(val => val._id),
                    firstname: members[0].firstname,
                    lastname: members[0].lastname,
                    birthday: members[0].birthday,
                }
            })

            members.forEach(async (member) => {
                member.openIssues.push(issue._id)
                if (!member.groups.includes(group._id)) {
                    member.groups.push(group._id)
                }
            })
            
            await members.save()
            return members
        }

        //Wenn bereits ein Member existiert, wird ein Issue erstellt, dass der Member zu einer Gruppe hinzugefügt wurde.
        members[0].memberId = members[0]._id

        //Wenn der Member bereits in der Gruppe ist, wird kein Issue erstellt und einfach nur der Member zurückgeben.
        if (members[0].groups.includes(group._id)) {
            return members[0]
        }

        //Wenn der Member noch nicht dem Department zugeordnet ist zu der die Gruppe gehört, wird ein Issue erstellt, dass der Member dem Department hinzugefügt wurde.
        //INFO Dieses Issues muss nicht erstellt werden. Es wird nur zum Tracken von Veränderungen erstellt
        if (!members[0].departments.includes(group.department)) {
            let issue = await Issue.create({
                tag: "memberWasAddedToDepartment",
                date: new Date(),
                body: {
                    memberID: members[0]._id,
                    firstname: members[0].firstname,
                    lastname: members[0].lastname,
                    birthday: members[0].birthday,
                    department: group.department,
                    groupID: group._id,
                    createdBy: user._id
                }
            })

            members[0]._doc.openIssues = [...members[0], issue._id]
        }

        //Member wird der Gruppe hinzugefügt
        members[0].push(group._id)

        await members.save()

        return members[0]
    }
}

const updateMember = async (memberBody) => {

    const id = memberBody._id || memberBody.memberId

    //INFO Dates müssen als Date Objekt gespeichert werden. Wenn der MemberBody direkt aus einer Request kommt, sind Daten ein String.

    if (typeof memberBody.birthday !== undefined) {
        memberBody.birthday = new Date(memberBody.birthday)
    }

    let member = await Member.findOne({ _id: id })

    member.overwrite(memberBody)

    await member.save()

    return member
}


module.exports = {
    getMembers,
    getMemberById,
    handleNewMemberEvent,
    updateMember
};
