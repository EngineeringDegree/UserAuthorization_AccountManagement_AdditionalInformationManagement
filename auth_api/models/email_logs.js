const Joi = require('joi')
const mongoose = require('mongoose')

const EmailLog = mongoose.model('EmailLog', new mongoose.Schema({
    message: {
        type: Object,
        required: true
    },
    status: {
        type: String,
        required: true
    },
    timestamp: {
        type: String,
        required: true
    }
}))

function validateEmailLog(email) {
    const schema = Joi.object({
        message: Joi.object().required(),
        status: Joi.string().required(),
        timestamp: Joi.string().required()
    })
    const validation = schema.validate(email)
    return validation
}

exports.EmailLog = EmailLog
exports.validateEmailLog = validateEmailLog