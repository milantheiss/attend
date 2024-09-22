const express = require('express');
const { dataController } = require('../controllers')
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const Joi = require('joi');

const router = express.Router();

const patchNotes = {
    body: Joi.object().keys({
        title: Joi.string().required(),
        message: Joi.string().required()
    })
};

/**
 * Braucht kein Access Control
 */
router
    .route('/')
    .post(verifyToken, validate(patchNotes), dataController.sendPatchnotes)

module.exports = router;