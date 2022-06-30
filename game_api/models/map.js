const Joi = require('joi')
const mongoose = require('mongoose')

const Map = mongoose.model('Map', new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    size: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    },
    fields: {
        type: Array,
        required: true
    },
    startingPositions: {
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
    }
}))
 
function validateMap(map) {
    const schema = Joi.object({
        name: Joi.string().required(),
        size: Joi.string().required(),
        image: Joi.string().required(),
        fields: Joi.array().required(),
        startingPositions: Joi.array().required(),
        readyToUse: Joi.boolean().required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(map)
    return validation
}
 
exports.Map = Map
exports.validate = validateMap