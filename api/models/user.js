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
        type: String,
        required: true
    },
    refreshToken: {
        type: String,
        required: true
    },
    accessToken: {
        type: String,
        required: true
    },
    confirmed: {
        type: Boolean
    },
    bans: {
        type: Array
    }
}))
 
function validateUser(user) {
    const schema = Joi.object({
        username: Joi.string().max(50).required(),
        email: Joi.string().email().required(),
        password: Joi.string().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        accessToken: Joi.string().required(),
    })
    const validation = schema.validate(user)
    return validation
}
 
exports.User = User
exports.validate = validateUser