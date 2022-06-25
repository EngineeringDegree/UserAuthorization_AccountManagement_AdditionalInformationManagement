const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
const { Card } = require('../../../models/card')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP'})
    }

    try{
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    }catch(e){
        return res.status(e.response.data.code).send({status: e.response.data.status, code: e.response.data.code, action: e.response.data.action})
    }
    
    if(user.data){
        await createCard(req.body)
        return res.status(200).send({status: 'CARD CREATED', code: 200, token: user.data.token})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Save card with following arguments
 * @param {object} card to save 
 */
async function createCard(card){
    var newCard = new Card(_.pick({
        name: card.name,
        image: card.image,
        type: card.type,
        nation: card.nation,
        resources: card.resources,
        attack: card.attack,
        defense: card.defense,
        mobility: card.mobility,
        effects: card.effects,
        readyToUse: true
    }, ['name', 'image', 'type', 'nation', 'resources', 'attack', 'defense', 'mobility', 'effects', 'readyToUse']))
    await newCard.save()
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
 function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        name: Joi.string().min(1).required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        image: Joi.string().required(),
        type: Joi.array().required(),
        nation: Joi.array().required(),
        resources: Joi.number().required(),
        attack: Joi.number().required(),
        defense: Joi.number().required(),
        mobility: Joi.number().required(),
        effects: Joi.array().required(),
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router