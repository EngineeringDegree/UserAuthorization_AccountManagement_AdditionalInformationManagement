const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
const { Map } = require('../../../models/map')

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
        await createMap(req.body)
        return res.status(200).send({status: 'MAP CREATED', code: 200, token: user.data.token})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Save map with following arguments
 * @param {object} map to save 
 */
async function createMap(map){
    var newMap = new Map(_.pick({
        name: map.name,
        size: map.size,
        image: map.image,
        fields: map.fields,
        startingPositions: map.startingPositions,
        readyToUse: true,
        description: map.description
    }, ['name', 'size', 'image', 'fields', 'startingPositions', 'readyToUse', 'description']))
    await newMap.save()
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
        size: Joi.string().required(),
        image: Joi.string().required(),
        fields: Joi.array().required(),
        startingPositions: Joi.array().required(),
        description: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router