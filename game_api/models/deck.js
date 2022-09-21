const Joi = require('joi')
const mongoose = require('mongoose')

const Deck = mongoose.model('Deck', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    cards: {
        type: Array,
        required: true
    },
    strength: {
        type: Number,
        required: true
    },
    owner: {
        type: String,
        required: true
    },
    deleted: {
        type: Boolean,
        required: true
    }
}))

function validateDeck(deck) {
    const schema = Joi.object({
        name: Joi.string().required(),
        nation: Joi.string().required(),
        cards: Joi.array().required(),
        strength: Joi.number().required(),
        owner: Joi.string().email().required(),
        deleted: Joi.boolean().required()
    })
    const validation = schema.validate(deck)
    return validation
}

exports.Deck = Deck
exports.validate = validateDeck