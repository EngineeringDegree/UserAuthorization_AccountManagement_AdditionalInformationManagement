const Joi = require('joi')
const mongoose = require('mongoose')

const Card_Effect = mongoose.model('Card_Effect', new mongoose.Schema({
    effectName: {
        type: String,
        required: true,
        unique: true
    },
    effectDescription: {
        type: String,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateCardEffect(effect) {
    const schema = Joi.object({
        effectName: Joi.string().required(),
        effectDescription: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(effect)
    return validation
}

exports.Card_Effect = Card_Effect
exports.validate = validateCardEffect