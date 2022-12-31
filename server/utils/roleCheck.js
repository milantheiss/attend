const admin = "admin"
const trainer = "trainer"
const assistant = "assistant"
const developer = "developer"

/**
 * Checks if user has access to group.
 * All admins and users whose accessible groups list includes the group ID, have access to a group.
 * @param {Array} roles Array of all roles assigned to a user
 * @param {import("mongoose").ObjectId} ID of the group to which the access is checked.
 * @returns {Boolean} 
 */
function hasAccessToGroup(user, groupID = undefined) {
    return hasAdminRole(user) || user.accessible_groups.includes(groupID)
}


function hasAdminRole(user){
    return user.roles.includes(admin)
}

function hasTrainerRole(user){
    return user.roles.includes(trainer)
}

function hasAssistantRole(user){
    return user.roles.includes(assistant)
}

function hasDeveloperRole(user){
    return user.roles.includes(developer)
}

module.exports = {
    hasAccessToGroup,
    hasAdminRole,
    hasTrainerRole,
    hasAssistantRole,
    hasDeveloperRole
}