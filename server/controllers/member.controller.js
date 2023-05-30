const logger = require('../config/logger');
const {memberService} = require('../services')
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { hasStaffAccess } = require('../utils/roleCheck');

const createMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        logger.debug('POST - create member - no access')
        res.status(httpStatus.FORBIDDEN).send({message: "You have no access to this resource"});
    }
    const result = await memberService.createMember(req.body);
    logger.debug('CREATED - new member')
    res.status(httpStatus.CREATED).send(result);
});

const updateMember = catchAsync(async (req, res) => {
    if(!hasStaffAccess(req.user)){
        logger.debug('POST - update member - no access')
        return {status: httpStatus.FORBIDDEN, message: "You have no access to this resource"}
    } 
    const result = await memberService.updateMember(req.body)

    res.status(httpStatus.OK).send(result)
})

const getAllMembers = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        logger.debug('GET - all members - no access')
        res.status(httpStatus.FORBIDDEN).send({message: "You have no access to this resource"});
    }
    const result = await memberService.getMembers();
    logger.debug('GET - all members')
    res.status(httpStatus.OK).send(result);
});

const deleteMember = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        logger.debug('DELETE - member - no access')
        res.status(httpStatus.FORBIDDEN).send({message: "You have no access to this resource"});
    }

    const result = await memberService.deleteMember(req.params.id);
    logger.debug('DELETED - member')
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    createMember,
    updateMember,
    getAllMembers,
    deleteMember
}

