const express = require('express');
const { dataController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

/**
 * Braucht kein Access Controll
 */
router
    .route('/')
    //INFO Everybody can access last patchnotes
    .get(dataController.getLastPatchNotes)
    .post(verifyToken, dataController.addNewPatchNote)

router
    .route("/markAsRead")
    .post(verifyToken, dataController.markPatchnotesAsRead)
    
module.exports = router;