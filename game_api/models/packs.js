const Joi = require('joi')
const mongoose = require('mongoose')

const Pack = mongoose.model('Pack', new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    cards: {
        type: Array,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    packName: {
        type: String,
        required: true
    },
    used: {
        type: Boolean,
        required: true
    }
}))

function validatePack(pack) {
    const schema = Joi.object({
        owner: Joi.string().email().required(),
        cards: Joi.array().required(),
        nation: Joi.string().required(),
        packName: Joi.string().required(),
        used: Joi.boolean().required()
    })
    const validation = schema.validate(pack)
    return validation
}

exports.Pack = Pack
exports.validate = validatePack