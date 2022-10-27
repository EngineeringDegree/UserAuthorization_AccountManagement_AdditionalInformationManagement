const Joi = require('joi')
const mongoose = require('mongoose')

// Abilities/skills of cards
const Card_Effect = mongoose.model('Card_Effect', new mongoose.Schema({
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
    vision: {
        type: Number,
        required: true
    },
    canUseOn: {
        type: Number,
        required: true
    },
    cooldown: {
        type: Number,
        required: true
    },
    duration: {
        type: Number,
        required: true
    },
    cost: {
        type: String,
        required: true
    },
    stunImmunity: {
        type: Boolean,
        required: true
    },
    scareImmunity: {
        type: Boolean,
        required: true
    },
    silenceImmunity: {
        type: Boolean,
        required: true
    },
    stun: {
        type: Boolean,
        required: true
    },
    scare: {
        type: Boolean,
        required: true
    },
    silence: {
        type: Boolean,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateCardEffect(effect) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        vision: Joi.number().required(),
        canUseOn: Joi.number().required(),
        cooldown: Joi.number().required(),
        duration: Joi.number().required(),
        cost: Joi.string().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        stun: Joi.boolean().required(),
        scare: Joi.boolean().required(),
        silence: Joi.boolean().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(effect)
    return validation
}

exports.Card_Effect = Card_Effect
exports.validate = validateCardEffect