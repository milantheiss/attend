const {departmentService} = require('../services')
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { hasStaffAccess } = require('../utils/roleCheck');

const getDepartments = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        res.status(httpStatus.FORBIDDEN).send({message: "You have no access to this resource"});
    }
    res.status(httpStatus.OK).send(await departmentService.getDepartments(req.body));
});

module.exports = {
    getDepartments
}

