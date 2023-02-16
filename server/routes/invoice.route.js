const express = require('express');
const { invoiceController } = require('../controllers')
const verifyToken = require('../middlewares/auth');

const router = express.Router();

router
    .route('/getDatasetForNewInvoice')
    .get(verifyToken, invoiceController.getDatasetForNewInvoice)

router
    .route("/submit")
    .post(verifyToken, invoiceController.submitInvoice)

router
    .route("/assigned")
    .get(verifyToken, invoiceController.getAllAssignedInvoices)


router
    .route("/getOwnInvoices")
    .get(verifyToken, invoiceController.getOwnInvoices)

router
    .route("/approve/:id")
    .post(verifyToken, invoiceController.approveInvoice)

router
    .route("/reject/:id")
    .post(verifyToken, invoiceController.rejectInvoice)

router
    .route("/reopen/:id")
    .post(verifyToken, invoiceController.reopenInvoice)

router
    .route("/getPendingInvoices")
    .get(verifyToken, invoiceController.getPendingInvoices)

router
    .route("/:id")
    .get(verifyToken, invoiceController.getInvoiceByID)

module.exports = router;