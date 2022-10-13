const Joi = require('joi')
const mongoose = require('mongoose')

const Card_Nation = mongoose.model('Card_Nation', new mongoose.Schema({
    nationName: {
        type: String,
        required: true,
        unique: true
    },
    nationDescription: {
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
        nationName: Joi.string().required(),
        nationDescription: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(nation)
    return validation
}

exports.Card_Nation = Card_Nation
exports.validate = validateCardNation