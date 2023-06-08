const logger = require('../config/logger');
const { issueService } = require('../services')
const catchAsync = require('../utils/catchAsync');
const httpStatus = require('http-status');
const { hasStaffAccess } = require('../utils/roleCheck');

const getIssues = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        logger.debug('GET - all issues - no access')
        res.status(httpStatus.FORBIDDEN).send({ message: "You have no access to this resource" });
    }
    const result = await issueService.getIssues();
    logger.debug('GET - all issues')
    res.status(httpStatus.OK).send(result);
});

const resolveIssue = catchAsync(async (req, res) => {
    if (!hasStaffAccess(req.user)) {
        logger.debug('POST - resolve issue - no access')
        res.status(httpStatus.FORBIDDEN).send({ message: "You have no access to this resource" });
    }

    const result = await issueService.resolveIssue(req.params.id, req.query.action);
    logger.debug('RESOLVED - issue')
    res.status(httpStatus.OK).send(result);
});

module.exports = {
    getIssues,
    resolveIssue
}

