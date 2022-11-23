const { PatchNotes, User } = require('../models');

/**
 * Get last Patchnotes.
 * @returns {Promise<[PatchNotes]>}
 */
const getLastPatchNotes = async () => {
    //INFO Everybody can access last patchnotes
    return PatchNotes.findOne({}, {}, { sort: { 'created_at': 1 } });
};

/**
 * Add a Patch Note.
 * Only account with the developer role have access to do so.
 * @returns {Promise<[PatchNotes.PatchNotes]>}
 */
const addNewPatchNote = async (user, body) => {
    if(user.roles.includes("developer")){
        //Mark Patchnotes as Unread for all Users
        User.updateMany({}, { $set: { readPatchnotes: false } })
        return PatchNotes.create(body);
    } else {
        throw new ApiError(httpStatus.UNAUTHORIZED, "Only developer are allowed to add new patch notes")
    }
};

/**
 * Marks patchnotes as read for User who triggers API call
 * @param {User} user User who triggers API call
 * @returns @see mongoose Object of the updated User
 */
const markPatchnotesAsRead = async (user) => {  
    //Needs no access control in function, because a user has to be verified as the user param originates from "verifyToken" function.
    return User.findByIdAndUpdate(user._id, { $set: { readPatchnotes: true } })
}


module.exports = {
    getLastPatchNotes,
    addNewPatchNote,
    markPatchnotesAsRead
};