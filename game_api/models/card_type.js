const Joi = require('joi')
const mongoose = require('mongoose')

// Type of card (It gives card class ability/skill)
const Card_Type = mongoose.model('Card_Type', new mongoose.Schema({
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
    buffNearbyAllies: {
        type: String,
        required: true
    },
    debuffNearbyEnemies: {
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
    charge: {
        type: Boolean,
        required: true
    },
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validateCardType(type) {
    const schema = Joi.object({
        name: Joi.string().required(),
        description: Joi.string().required(),
        buffNearbyAllies: Joi.string().required(),
        debuffNearbyEnemies: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        charge: Joi.boolean().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(type)
    return validation
}

exports.Card_Type = Card_Type
exports.validate = validateCardType