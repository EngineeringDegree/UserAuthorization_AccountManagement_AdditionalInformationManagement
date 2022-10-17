const Joi = require('joi')
const mongoose = require('mongoose')

// Type of effect (It gives effect to the card, like panic, buffs or debuffs not dependent on map field, card effecr or card type or card nation)
const Effect = mongoose.model('Effect', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    basicDuration: {
        type: Number,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateEffect(effect) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        basicDuration: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(effect)
    return validation
}

exports.Effect = Effect
exports.validate = validateEffect