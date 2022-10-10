const Joi = require('joi')
const mongoose = require('mongoose')

const Rating = mongoose.model('Rating', new mongoose.Schema({
    owner: {
        type: String,
        required: true
    },
    nation: {
        type: String,
        required: true
    },
    rating: {
        type: Number,
        required: true
    }
}))

function validateRating(rating) {
    const schema = Joi.object({
        owner: Joi.string().email().required(),
        nation: Joi.string().required(),
        rating: Joi.number().required()
    })
    const validation = schema.validate(rating)
    return validation
}

exports.Rating = Rating
exports.validate = validateRating