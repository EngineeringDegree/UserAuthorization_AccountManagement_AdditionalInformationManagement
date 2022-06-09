const Joi = require('joi')
const mongoose = require('mongoose')

const Map = mongoose.model('Map', new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}))
 
function validateMap(map) {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    const validation = schema.validate(map)
    return validation
}
 
exports.Map = Map
exports.validate = validateMap