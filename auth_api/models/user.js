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
    token: {
        type: Array,
        required: true
    },
    refreshToken: {
        type: Array,
        required: true
    },
    accessToken: {
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
    money: {
        type: Array
    }
}))
 
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        token: Joi.array().required(),
        refreshToken: Joi.array().required(),
        accessToken: Joi.string().required(),
        confirmed: Joi.Boolean().required(),
        admin: Joi.Boolean().required(),
        bans: Joi.Array(),
        money: Joi.Array()
    })
    const validation = schema.validate(user)
    return validation
}
 
exports.User = User
exports.validate = validateUser