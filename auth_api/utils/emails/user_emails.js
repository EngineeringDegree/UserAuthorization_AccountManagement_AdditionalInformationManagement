
const nodemailer = require('nodemailer')
const _ = require('lodash')
const { EmailLog } = require('../../models/email_logs')

/**
 * Sends an email email to which user changed
 * @param {object} data contains email and authorization token 
 */
async function sendConfirmationEmail(data) {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_ADDRESS,
        port: process.env.EMAIL_SERVICE_PORT,
        secure: true,
        auth: {
            user: process.env.CONFIRMATION_EMAIL,
            pass: process.env.CONFIRMATION_EMAIL_PASSWORD
        }
    })

    var mailOptions = {
        from: process.env.CONFIRMATION_EMAIL,
        to: data.email,
        subject: `${process.env.GAME_NAME} email confirmation`,
        html: `<p>Please confirm your email by clicking this <a href="${process.env.SERVER_ADDRESS}authorize?email=${data.email}&accessToken=${data.accessToken}">link</a>.</p>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            putEmailLog(error, "error")
        } else {
            putEmailLog(info, "success")
        }
    })
}

/**
 * Sends an email with password change link
 * @param {object} data contains email and authorization token of process
 */
async function sendPasswordChangeEmail(data) {
    var transporter = nodemailer.createTransport({
        host: process.env.EMAIL_SERVICE_ADDRESS,
        port: process.env.EMAIL_SERVICE_PORT,
        secure: true,
        auth: {
            user: process.env.CONFIRMATION_EMAIL,
            pass: process.env.CONFIRMATION_EMAIL_PASSWORD
        }
    })

    var mailOptions = {
        from: process.env.CONFIRMATION_EMAIL,
        to: data.email,
        subject: `${process.env.GAME_NAME} email confirmation`,
        html: `<p>Change your password <a href="${process.env.SERVER_ADDRESS}password/change?email=${data.email}&accessToken=${data.accessToken}">here</a>.</p>`
    }

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            putEmailLog(error, "error")
            return false
        } else {
            putEmailLog(info, "success")
            return true
        }
    })
}

/**
 * Saves log if email has error or not to database
 * @param {object} body to save in database
 * @param {string} status if email was sended
 */
async function putEmailLog(body, status) {
    const currentDate = new Date();
    const timestamp = currentDate.getTime();
    var newLog = new EmailLog(_.pick({
        message: body,
        status: status,
        timestamp: timestamp
    }, ['message', 'status', 'timestamp']))
    await newLog.save()
}

module.exports = { sendConfirmationEmail, sendPasswordChangeEmail }