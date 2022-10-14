const Joi = require('joi')
const mongoose = require('mongoose')

const Card_Nation = mongoose.model('Card_Nation', new mongoose.Schema({
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

function validateCardNation(nation) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(nation)
    return validation
}

exports.Card_Nation = Card_Nation
exports.validate = validateCardNation