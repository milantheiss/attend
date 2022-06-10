const logger = require('../config/logger')
const {memberService} = require('../services')
const httpStatus = require('http-status');
const pick = require('../utils/pick');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');

//TODO Implement simple GET
const getMembers = catchAsync(async (req, res) => {
    const result = await memberService.getMembers();
    res.send(result);
});

const addMember = catchAsync(async (req, res) => {
    const result = await memberService.addMember(req.body);
    res.send(result);
});

module.exports = {
    getMembers,
    addMember
}

