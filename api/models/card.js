const Joi = require('joi')
const mongoose = require('mongoose')

const Card = mongoose.model('Card', new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
}))
 
function validateCard(card) {
    const schema = Joi.object({
        name: Joi.string().required()
    })
    const validation = schema.validate(card)
    return validation
}
 
exports.Card = Card
exports.validate = validateCard