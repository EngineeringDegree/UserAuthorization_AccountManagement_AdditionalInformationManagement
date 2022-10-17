const Joi = require('joi')
const mongoose = require('mongoose')

// Type of card (It gives card class ability/skill)
const Card_Type = mongoose.model('Card_Type', new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateCardType(type) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(type)
    return validation
}

exports.Card_Type = Card_Type
exports.validate = validateCardType