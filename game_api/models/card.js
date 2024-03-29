const Joi = require('joi')
const mongoose = require('mongoose')

// Card object
const Card = mongoose.model('Card', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    type: {
        type: Array,
        required: true
    },
    nation: {
        type: Array,
        required: true
    },
    resources: {
        type: Number,
        required: true
    },
    attack: {
        type: Number,
        required: true
    },
    defense: {
        type: Number,
        required: true
    },
    mobility: {
        type: Number,
        required: true
    },
    vision: {
        type: Number,
        required: true
    },
    effects: {
        type: Array,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    basicDeck: {
        type: Number,
        required: true
    }
}))

function validateCard(card) {
    const schema = Joi.object({
        name: Joi.string().required(),
        image: Joi.string().required(),
        type: Joi.array().required(),
        nation: Joi.array().required(),
        resources: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        mobility: Joi.number().required(),
        vision: Joi.number().required(),
        effects: Joi.array().required(),
        readyToUse: Joi.boolean().required(),
        description: Joi.string().required(),
        basicDeck: Joi.number().required()
    })
    const validation = schema.validate(card)
    return validation
}

exports.Card = Card
exports.validate = validateCard