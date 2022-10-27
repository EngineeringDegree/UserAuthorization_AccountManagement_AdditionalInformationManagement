const Joi = require('joi')
const mongoose = require('mongoose')

const User = mongoose.model('User', new mongoose.Schema({
    username: {
        type: String,
        required: true,
        maxlength: 50,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean,
        required: true
    },
    admin: {
        type: Boolean,
        required: true
    },
    bans: {
        type: Array
    },
    funds: {
        type: Number,
        required: true
    }
}))

function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        confirmed: Joi.boolean().required(),
        admin: Joi.boolean().required(),
        bans: Joi.array(),
        funds: Joi.number().required()
    })
    const validation = schema.validate(user)
    return validation
}

exports.User = User
exports.validate = validateUser