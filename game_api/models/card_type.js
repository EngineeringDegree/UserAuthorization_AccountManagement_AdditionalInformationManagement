const Joi = require('joi')
const mongoose = require('mongoose')

const Card_Type = mongoose.model('Card_Type', new mongoose.Schema({
    typeName: {
        type: String,
        required: true,
        unique: true
    },
    typeDescription: {
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
        typeName: Joi.string().required(),
        typeDescription: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(type)
    return validation
}

exports.Card_Type = Card_Type
exports.validate = validateCardType