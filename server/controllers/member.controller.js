const logger = require('../config/logger');
const {memberService} = require('../services')
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');

const addMember = catchAsync(async (req, res) => {
    const result = await memberService.addMember(req.user, req.body);
    logger.debug('CREATED - new member')
    res.status(httpStatus.CREATED).send(result);
});

module.exports = {
    addMember
}

