const Joi = require('joi')
const mongoose = require('mongoose')

// Type of map field (It gives effect to the card which is on it)
const Map_Field = mongoose.model('Map_Field', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    basicDefence: {
        type: Number,
        required: true
    },
    basicMobilityCost: {
        type: Number,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateMapField(field) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        basicDefence: Joi.number().required(),
        basicMobilityCost: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(field)
    return validation
}

exports.Map_Field = Map_Field
exports.validate = validateMapField