const nodemailer = require('nodemailer');
const config = require('../config/config');
const logger = require('../config/logger');
const ApiError = require('../utils/ApiError');
const httpStatus = require('http-status');
const { createInvoice } = require("../utils/generatePdf")

const transport = nodemailer.createTransport(config.email.smtp);
/* istanbul ignore next */
if (config.env !== 'test') {
  transport
    .verify()
    .then(() => logger.info('Connected to email server'))
    .catch(() => logger.warn('Unable to connect to email server. Make sure you have configured the SMTP options in .env'));
}

/**
 * Send an email
 * @param {string} to
 * @param {string} subject
 * @param {string} text
 * @returns {Promise}
 */
const sendEmail = async (to, subject, text, attachments = [], cc = "") => {
  try {
    const msg = { from: { name: "Noreply Attend", address: "noreply@milantheiss.de" }, to, subject, text, attachments, cc };
    await transport.sendMail(msg);
  } catch (error) {
    console.error(error);
    // throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, "Email konnte nicht versendet werden. Bitte überprüfe deine Angaben.")
  }
};

const sendAccountDetails = async (to, details) => {
  const subject = 'Account Details - Append App';
  const text = `Hallo ${details.firstname} ${details.lastname},\nHier sind deine Zugangsdaten:\nEmail: ${details.email}\nPasswort: ${details.password}\nhttps://attend.milantheiss.de`;
  return await sendEmail(to, subject, text);
}

/**
 * Send reset password email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendResetPasswordEmail = async (to, token) => {
  const subject = 'Reset password';
  // replace this url with the link to the reset password page of your front-end app
  const resetPasswordUrl = `http://link-to-app/reset-password?token=${token}`;
  const text = `Dear user,
To reset your password, click on this link: ${resetPasswordUrl}
If you did not request any password resets, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Send verification email
 * @param {string} to
 * @param {string} token
 * @returns {Promise}
 */
const sendVerificationEmail = async (to, token) => {
  const subject = 'Email Verification';
  // replace this url with the link to the email verification page of your front-end app
  const verificationEmailUrl = `http://link-to-app/verify-email?token=${token}`;
  const text = `Dear user,
To verify your email, click on this link: ${verificationEmailUrl}
If you did not create an account, then ignore this email.`;
  await sendEmail(to, subject, text);
};

/**
 * Sends invoice notification mail
 * @param {string} to Mail address of reviewer
 * @param {Object} invoice Invoice object
 * @returns {Promise}
 */
const sendInvoiceNotificationMail = async (to, invoice) => {
  const subject = `Neue Abrechnung von ${invoice.submittedBy.firstname} ${invoice.submittedBy.lastname} - ${new Date().toLocaleDateString('de-DE', { year: "numeric", month: "numeric", day: "numeric" })}`;
  const text = `${invoice.submittedBy.firstname} ${invoice.submittedBy.lastname} hat eine neue Abrechnung erstellt.\nBitte überprüfe die Abrechnung: https://${config.domain}/review-invoice?id=${invoice._id}`;
  console.log(to);

  await sendEmail(to, subject, text);
}

/**
 * Sends invoice approval mail
 * @param {string} to Mail address of reviewer
 * @param {string} cc Mail address of submitter
 * @param {Object} invoice Invoice object
 * @returns {Promise}
 */
const sendInvoiceApprovalEmail = async (to, cc, invoice) => {
  const subject = `GENEHMIGT: Abrechnung - ${invoice.submittedBy.firstname} ${invoice.submittedBy.lastname} - ${new Date(invoice.dateOfReceipt).toLocaleDateString('de-DE', { year: "numeric", month: "numeric", day: "numeric" })}`;
  const text = `Abrechnung von ${invoice.submittedBy.firstname} ${invoice.submittedBy.lastname} wurde am ${new Date().toLocaleDateString('de-DE', { year: "numeric", month: "numeric", day: "numeric" })} genehmigt.\nDie Abrechnung findest du im Anhang.`;

  const attachments = [
    {
      filename: `Abrechnung_${invoice.submittedBy.lastname}_${invoice.submittedBy.firstname}_${new Date(invoice.dateOfReceipt).toJSON().split("T")[0]}.pdf`,
      path: await createInvoice(invoice)
    }
  ];
  await sendEmail(to, subject, text, attachments, cc);
};

module.exports = {
  transport,
  sendEmail,
  sendResetPasswordEmail,
  sendVerificationEmail,
  sendAccountDetails,
  sendInvoiceApprovalEmail,
  sendInvoiceNotificationMail,
};