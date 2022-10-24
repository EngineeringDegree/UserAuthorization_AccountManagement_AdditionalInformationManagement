const Joi = require('joi')
const mongoose = require('mongoose')

const Game = mongoose.model('Game', new mongoose.Schema({
    player1: {
        type: Object,
        required: true
    },
    player2: {
        type: Object,
        required: true
    },
    player1Fog: {
        type: Object,
        required: true
    },
    player2Fog: {
        type: Object,
        required: true
    },
    map: {
        type: Object,
        required: true
    },
    currentState: {
        type: Object,
        required: true
    },
    settings: {
        type: Object,
        required: true
    },
    history: {
        type: Array,
        required: true
    },
    player1Starts: {
        type: Boolean,
        required: true
    },
    weakerPlayerChoosed: {
        type: Boolean,
        required: true
    },
    outcome: {
        type: Object,
        required: true
    },
    finished: {
        type: Boolean,
        required: true
    }
}))

function validateGame(game) {
    const schema = Joi.object({
        player1: Joi.object().required(),
        player2: Joi.object().required(),
        player1Fog: Joi.object().required(),
        player2Fog: Joi.object().required(),
        map: Joi.object().required(),
        currentState: Joi.object().required(),
        settings: Joi.object().required(),
        history: Joi.array().required(),
        player1Starts: Joi.boolean().required(),
        weakerPlayerChoosed: Joi.boolean().required(),
        outcome: Joi.object().required(),
        finished: Joi.boolean().required()
    })
    const validation = schema.validate(game)
    return validation
}

exports.Game = Game
exports.validate = validateGame