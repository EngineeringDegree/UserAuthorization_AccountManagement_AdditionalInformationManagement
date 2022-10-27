const Joi = require('joi')
const mongoose = require('mongoose')

const Token = mongoose.model('Token', new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true
    },
    token: {
        type: String,
        required: true
    },
    issuedAt: {
        type: String,
        required: true
    }
}))

function validateToken(token) {
    const schema = Joi.object({
        owner: Joi.string().email().required(),
        type: Joi.string().required(),
        token: Joi.string().required(),
        issuedAt: Joi.string().required()
    })
    const validation = schema.validate(token)
    return validation
}

exports.Token = Token
exports.validate = validateToken