const express = require('express');
const { invoiceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');
const validate = require('../middlewares/validate');
const { invoiceValidation } = require('../validations');

const router = express.Router();

router
    .route('/getDatasetForNewInvoice')
    .get(verifyToken, validate(invoiceValidation.getDatasetForNewInvoice), invoiceController.getDatasetForNewInvoice)

router
    .route("/submit")
    .post(verifyToken, validate(invoiceValidation.submitInvoice), invoiceController.submitInvoice)

router
    .route("/assigned")
    .get(verifyToken, invoiceController.getAllAssignedInvoices)


router
    .route("/getOwnInvoices")
    .get(verifyToken, invoiceController.getOwnInvoices)

router
    .route("/getPendingInvoices")
    .get(verifyToken, invoiceController.getPendingInvoices)

router
    .route("/getAllInYear/:year")
    .get(verifyToken, validate(invoiceValidation.getAllInYear), invoiceController.getAllInYear)

router
    .route("/approve/:id")
    .post(verifyToken, validate(invoiceValidation.approveInvoice), invoiceController.approveInvoice)

router
    .route("/reject/:id")
    .post(verifyToken, validate(invoiceValidation.rejectInvoice), invoiceController.rejectInvoice)

router
    .route("/reopen/:id")
    .post(verifyToken, validate(invoiceValidation.reopenInvoice), invoiceController.reopenInvoice)

router
    .route("/:id")
    .get(verifyToken, validate(invoiceValidation.getInvoiceByID), invoiceController.getInvoiceByID)

module.exports = router;