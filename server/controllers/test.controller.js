const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');

const updateTest = catchAsync(async (req, res) => {
    console.log(req.body)
    req.body.testString += "äöüß"
    req.body.newTestString = "ÄÖÜäöüß"
    console.log(req.body)
    res.status(httpStatus.OK).send(req.body);
});

const getTest = catchAsync(async (req, res) => {
    const result = {
        testString: "ÄÖÜäöüß"
    }
    console.log(result);
    
    //.setHeader('Content-Type', 'application/json; charset=utf-8')
    res.status(httpStatus.OK).send(result)
})


module.exports = {
    updateTest,
    getTest
}

