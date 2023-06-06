const express = require('express');
const { issueController } = require('../controllers');
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const Joi = require('joi');

const router = express.Router();

const resolveIssue = {
    params: Joi.object().keys({
        //String als ObjectId
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),
    }),
    query: Joi.object().keys({
        //String, der die Action beschreibt
        //Regex nur Klein- & Großbuchstaben
        //Regex: 
        action: Joi.string().pattern(/^[a-zA-Z]+/m).required()
    })
} 

router
    .route('/')
    .get(verifyToken, issueController.getIssues)

router
    .route('/:id/resolve')
    .post(verifyToken, validate(resolveIssue), issueController.resolveIssue)


module.exports = router;
