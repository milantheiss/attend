const { notificationService } = require('../services')
const { hasAdminRole, hasDeveloperRole } = require('../utils/roleCheck');
const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const ApiError = require('../utils/ApiError');

const sendPatchnotes = catchAsync(async (req, res) => {
    if (!hasAdminRole(req.user) && !hasDeveloperRole) throw new ApiError(httpStatus.FORBIDDEN, "User is not allowed to send a notification to all users")

    const body = {
        ...req.body,
        type: "patchnotes",
        priority: "low"
    }

    const notification = await notificationService.sendNotificationToAllUsers(body);
    res.status(httpStatus.OK).send(notification);
});

module.exports = {
    sendPatchnotes
}