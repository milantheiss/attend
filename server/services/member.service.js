const httpStatus = require('http-status');
const { default: mongoose } = require('mongoose');
const { Member, Issue } = require('../models');
const Group = require('../models/group.model');
const User = require('../models/user.model');
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
    Der Member wird vorerst nur in der Gruppe erstellt.
    Es wird ein Issue erstellt, damit ein Sachbearbeiter den User verifizieren kann.
    */
    if (members.length === 0) {
        let openIssue = await Issue.findOne({
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
        if (openIssue === null || typeof openIssue === "undefined") {
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
                    birthday: memberBody.birthday,
                    department: group.department._id
                }
            })
            memberBody._id = newID
            memberBody.openIssue = issue._id
        } else { //Wenn bereits ein Issue oder MultiGroup Issue existiert.
            //Wenn nur ein einzelnes Issue existiert.
            if (openIssue.tag === "newMember") {
                //Stellt sicher, dass kein MultiGroupIssue für einen Member erstellt wird, der zwei Mal in die gleiche Gruppe hinzugefügt wird.
                if (!openIssue.body.groupID.equals(group._id)) {
                    await Issue.deleteOne({ _id: openIssue._id })

                    //Gibt Array zurück. b wird nur dem Array hinzugefügt, wenn er sich vom a unterscheidet. --> entspricht $addToSet von MongoDB 
                    //Schützt vor Duplication Conflict
                    //INFO Funktioniert nur mit mongoose.ObjectID
                    const _addToSet = (a, b) => {
                        return (a.equals(b)) ? [a] : [a, b]
                    }

                    const multiGroupIssue = await Issue.create({
                        tag: 'newMemberInMultipleGroups',
                        date: openIssue.date,
                        body: {
                            groupIDs: [openIssue.body.groupID, group._id],
                            memberID: openIssue.body.memberID,
                            createdBy: [openIssue.body.createdBy, user._id],
                            firstname: memberBody.firstname,
                            lastname: memberBody.lastname,
                            birthday: memberBody.birthday,
                            department: _addToSet(openIssue.body.department, group.department._id)
                        },
                        _id: openIssue._id
                    })
                    memberBody.openIssue = multiGroupIssue._id
                }
            } else { //Wenn schon ein MultiGroupIssue existiert.
                //Schützt vor Duplication Conflict.
                if (!openIssue.body.groupIDs.includes(group._id)) {
                    openIssue = await Issue.findByIdAndUpdate(openIssue._id, { $addToSet: { "body.groupIDs": group._id, "body.department": group.department._id }, $push: { "body.createdBy": user._id } })
                }
                memberBody.openIssue = openIssue._id
            }

            memberBody._id = openIssue.body.memberID
        }
    } else if (members.length > 1) { //Wenn es mehr als einen gleichen Member gibt.
        //* --> Issue für Duplicate Conflict wird erstellt.
        const issueBody = {
            tag: "duplicateMemberInDB",
            date: new Date(),
            body: {
                memberIDs: [],
                firstname: members[0].firstname,
                lastname: members[0].lastname,
                birthday: members[0].birthday,
            }
        }

        members.forEach(val => issueBody.body.memberIDs.push(val._id))

        const openIssue = await Issue.create(issueBody)
        throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, `Internal database error detected: The database contains several members with the same basic data. The system has created a ticket with the ID ${openIssue._id}. Please contact a system administrator.`)
    } else if (!members[0].departments.some(v => v.equals(group.department._id))) { //Wenn Member in DB schon existiert, aber noch nicht Teil des Department ist. 
        //* --> Issue zum hinzufügen zur Abteilung wird erstellt.

        //WARNING Im Moment wird dem Member zwar die GroupID hinzugefügt, jedoch nicht die Id des Departments
        //TODO Überarbeiten 


        let openIssue = await Issue.findOne({
            $and: [
                { tag: "addMemberToDepartment" },
                { "body.memberID": members[0]._id },
                { "body.department": group.department._id }
            ]
        })

        if (openIssue === null || typeof openIssue === "undefined") {
            let openIssue = await Issue.create({
                tag: "addMemberToDepartment",
                date: new Date(),
                body: {
                    memberID: members[0]._id,
                    firstname: members[0].firstname,
                    lastname: members[0].lastname,
                    birthday: members[0].birthday,
                    department: group.department._id,
                    groupIDs: [group._id],
                    createdBy: [user._id]
                }
            })

            memberBody.openIssue = openIssue._id
            memberBody._id = members[0]._id
        } else {
            if (!openIssue.body.groupIDs.includes(group._id)) {
                await Issue.findByIdAndUpdate(openIssue._id, { $addToSet: { "body.groupIDs": group._id }, $push: { "body.createdBy": user._id } })
            }

            memberBody.openIssue = openIssue._id
            memberBody._id = openIssue.body.memberID
        }

        await Member.findByIdAndUpdate(members[0]._id, { $addToSet: { groups: group._id } })
    } else {//Wenn der Member schon in DB existiert und auch Teil des Departments ist.
        //* --> Member wird der neuen Gruppe ohne Issue hinzugefügt.
        await Member.findByIdAndUpdate(members[0]._id, { $addToSet: { groups: group._id } })
        memberBody._id = members[0]._id
    }

    return memberBody
}

module.exports = {
    getMembers,
    getMemberById,
    handleNewMemberEvent
};
