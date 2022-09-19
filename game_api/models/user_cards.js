const Joi = require('joi')
const mongoose = require('mongoose')

const UserCard = mongoose.model('UserCard', new mongoose.Schema({
    owner: {
        type: String,
        unique: true,
        required: true
    },
    cards: {
        type: Array,
        required: true
    }
}))

function validateUserCard(userCard) {
    const schema = Joi.object({
        owner: Joi.string().email().required(),
        cards: Joi.array().required()
    })
    const validation = schema.validate(userCard)
    return validation
}

exports.UserCard = UserCard
exports.validate = validateUserCard