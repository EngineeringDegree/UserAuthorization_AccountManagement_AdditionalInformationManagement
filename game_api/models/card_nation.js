const Joi = require('joi')
const mongoose = require('mongoose')

// All possible nations of cards
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
    mobility: {
        type: Number,
        required: true
    },
    defence: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
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
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(nation)
    return validation
}

exports.Card_Nation = Card_Nation
exports.validate = validateCardNation