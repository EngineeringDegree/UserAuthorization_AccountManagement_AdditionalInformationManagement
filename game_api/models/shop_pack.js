const Joi = require('joi')
const mongoose = require('mongoose')

const Shop_Pack = mongoose.model('Shop_Pack', new mongoose.Schema({
    cardsCount: {
        type: Number,
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
    readyToUse: {
        type: Boolean,
        required: true
    }
}))

function validatePack(pack) {
    const schema = Joi.object({
        cardsCount: Joi.number().required(),
        nation: Joi.string().required(),
        packName: Joi.string().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(pack)
    return validation
}

exports.Shop_Pack = Shop_Pack
exports.validate = validatePack