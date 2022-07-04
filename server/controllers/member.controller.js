const {memberService} = require('../services')
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

