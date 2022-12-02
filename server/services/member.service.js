const httpStatus = require('http-status');
const { default: mongoose } = require('mongoose');
const { Member, Issue } = require('../models');
const ApiError = require('../utils/ApiError');
const { hasAdminRole } = require('../utils/userroles');


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

const handleNewMemberRequest = async (user, group, memberBody) => {
    //Sucht nach Membern mit dem gleichen Namen und Geburtsdatum
    const members = await Member.find({
        $and: [
            { lastname: memberBody.lastname },
            { firstname: memberBody.firstname },
            { birthday: memberBody.birthday }
        ]
    })

    //WARNING Duplication Conflict möglich, wenn ein Temp User in zwei Gruppen zwei Mal angelegt wird.

    /*
    Wenn keine gleichen Member gefunden wurden, heißt ein neuer Member hinzugefügt wurde. 
    Der Member wird vorerst nur in der Gruppe erstellt.
    Es wird ein Issue erstellt, damit ein Sachbearbeiter den User verifizieren kann.
    */
    if (members.length === 0) {
        console.log('Totally new Member');
        let openissue = await Issue.findOne({
            $or: [
                {
                    $and: [
                        { tag: "newMember" },
                        { "body.firstname": memberBody.firstname },
                        { "body.lastname": memberBody.lastname },
                        { "body.birthday": memberBody.birthday }
                    ]
                },
                {
                    $and: [
                        { tag: "newMemberInMultipleGroups" },
                        { "body.firstname": memberBody.firstname },
                        { "body.lastname": memberBody.lastname },
                        { "body.birthday": memberBody.birthday }
                    ]
                }
            ]
        })

        //Wenn kein Issue existiert.
        if (openissue === null || typeof openissue === "undefined") {
            const newID = new mongoose.Types.ObjectId()
            const issue = await Issue.create({
                tag: 'newMember',
                date: new Date(),
                body: {
                    groupID: group._id,
                    memberID: newID,
                    createdBy: user._id,
                    firstname: memberBody.firstname,
                    lastname: memberBody.lastname,
                    birthday: memberBody.birthday
                }
            })
            memberBody._id = newID
            memberBody.openIssue = issue._id
        } else { //Wenn bereits ein Issue oder MultiGroup Issue existiert.
            //Wenn nur ein einzelnes Issue existiert.
            //TODO Sicherstellen, dass keine zwei gleich benannte Member in einer Gruppe sind
            if (openissue.tag === "newMember") {
                await Issue.deleteOne({ _id: openissue._id })
                const multiGroupIssue = await Issue.create({
                    tag: 'newMemberInMultipleGroups',
                    date: openissue.date,
                    body: {
                        groupIDs: [
                            openissue.body.groupID,
                            group._id
                        ],
                        memberID: openissue.body.memberID,
                        createdBy: [
                            openissue.body.createdBy,
                            user._id,
                        ],
                        firstname: memberBody.firstname,
                        lastname: memberBody.lastname,
                        birthday: memberBody.birthday
                    },
                    _id: openissue._id
                })

                memberBody.openIssue = multiGroupIssue._id
            } else { //Wenn schon ein MultiGroupIssue existiert.
                openissue = await Issue.findByIdAndUpdate(openissue._id, { "body.groupIDs": { $addToSet: group._id }, "body.createdBy": { $addToSet: user._id } })
                memberBody.openIssue = openissue._id
            }

            memberBody._id = openissue.body.memberID
        }
    } else if (members.length > 1) { //Wenn es mehr als einen gleichen Member gibt.
        console.log('DuplicateMemberInDB');

        //* --> Issue für Duplicate Conflict wird erstellt.
        const issueBody = {
            tag: "duplicateMemberInDB",
            date: new Date(),
            body: {
                memberIDs: [],
                firstname: members[0].body.firstname,
                lastname: members[0].body.lastname,
                birthday: members[0].body.birthday,
            }
        }

        members.forEach(val => issueBody.body.memberIDs.push(val._id))

        const openissue = await Issue.create(issueBody)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Internal database error detected: The database contains several members with the same basic data. The system has created a ticket with the ID ${openissue._id}. Please contact a system administrator.`)
    } else if (!members[0].departments.some(v => v === group.department._id)) { //Wenn Member in DB schon existiert, aber noch nicht Teil des Department ist. 
        console.log('Add Member to Department');

        //* --> Issue zum hinzufügen zur Abteilung wird erstellt.

        let openissue = await Issue.find({
            $and: [
                { tag: "addMemberToDepartment" },
                { "body.memberID": members[0]._id }
            ]
        })

        if (openissue === null || typeof openissue === "undefined" || !openissue.some(val => val.body.department === group.department._id)) {
            let openissue = await Issue.create({
                tag: "addMemberToDepartment",
                date: new Date(),
                body: {
                    memberID: members[0]._id,
                    firstname: members[0].body.firstname,
                    lastname: members[0].body.lastname,
                    birthday: members[0].body.birthday,
                    department: group.department._id,
                    createdBy: user._id
                }
            })
            memberBody.openIssue = openissue._id
            memberBody._id = members[0]._id
        } 
        memberBody.openIssue = openissue._id
        memberBody._id = openissue.body.memberID
    } else {//Wenn der Member schon in DB existiert und auch Teil des Departments ist.
        console.log('Add Member to group');

        //* --> Member wird der neuen Gruppe ohne Issue hinzugefügt.
        await Member.findByIdAndUpdate(members[0]._id, { groups: { $addToSet: group._id } })
        memberBody._id = members[0]._id
    }

    return memberBody
}

//TODO UpdateMember


module.exports = {
    getMembers,
    getMemberById,
    handleNewMemberRequest
};
