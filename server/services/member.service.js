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

/**
 * Create a Group
 * @param {Object} memberBody
 * @returns {Promise<Member>}
 */
const addMember = async (user, memberBody) => {
    if (hasAdminRole(user)) {
        return Member.create(memberBody);
    } else {
        throw new ApiError(httpStatus.FORBIDDEN, "The user is not permitted to create a new member")
    }

};

const updateMember = async (user, group, memberBody) => {
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
        const openissue = await Issue.find({
            $and: [
                { tag: "newMember" },
                { "body.firstname": memberBody.firstname },
                { "body.lastname": memberBody.lastname },
                { "body.birthday": memberBody.birthday }
            ]
        })

        //Wenn kein Issue existiert oder ein MultiGroup Issue schon existiert.
        if (openissue === null || typeof openissue === "undefined") {
            const multiGroupIssue = await Issue.find({
                $and: [
                    { tag: "newMemberInMultipleGroups" },
                    { "body.firstname": memberBody.firstname },
                    { "body.lastname": memberBody.lastname },
                    { "body.birthday": memberBody.birthday }
                ]
            })

            //Wenn kein auch kein MultiGroupIssue existiert
            if (multiGroupIssue === null || typeof multiGroupIssue === "undefined") {
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
            } else { //Wenn ein MultiGroupIssue existiert.
                await Issue.findByIdAndUpdate(multiGroupIssue._id, { "body.groupIDs": { $addToSet: group._id } })
            }
        } else { //Wenn bereits ein Issue existiert, aber noch kein MultiGroup Issue erstellt wurde.
            await Issue.deleteOne({ _id: openissue._id })
            const multiGroupIssue = await Issue.create({
                tag: 'newMemberInMultipleGroups',
                date: openissue.date,
                body: {
                    groupIDs: [
                        openissue.body.groupID,
                        group._id
                    ],
                    memberID: openissue._id,
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

            memberBody._id = openissue._id
            memberBody.openIssue = issue._id
        }


        console.log(memberBody);
    } else if (members.length > 1) { //Wenn es mehr als einen gleichen Member gibt.
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
     
        await Issue.create(issueBody)
    } else if (!members[0].departments.some(v => v === group.department._id)) { //Wenn gleicher Members nicht im selben Department ist. 
        //* --> Issue zum hinzufügen zur Abteilung wird erstellt.

        const openIssues = await Issue.find({tag: "addMemberToDepartment"})

        if(!openIssues.some(val => val.body.memberID === members[0]._id) && !openIssues.some(val => val.body.department === group.department._id)) {
            await Issue.create({
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
        }

    } else {
        if (members[0].groups.some(v => v === group._id)) {
            //* --> Issue wird erstellt, um Member in Datenbank zu bearbeiten.
        } else {
            //* --> Member wird der neuen Gruppe ohne Issue hinzugefügt.
        }
    }


    return memberBody
}

//TODO Add new Functions here
module.exports = {
    getMembers,
    getMemberById,
    addMember,
    updateMember
};
