const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')
const { Map } = require('../../../models/map')

// Middleware for patching map
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP'})
    }

    let user = await User.findOne({ email: req.body.email })
    if(user){
        if(user.admin){
            if(checkIfBanned(user)){
                return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
            }
            
            let map = await Map.findOne({ _id: req.body.id })
            if(!map){
                return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'GO TO MAPS'})
            }

            var check = checkToken(user.token, req.body.token)
            if(!check){
                check = await askNewToken(user.refreshToken, req.body.refreshToken, user)
                if(check){
                    const filter = {
                        _id: map._id
                    }
                    const update = {
                        name: req.body.name,
                        size: req.body.size,
                        image: req.body.image,
                        fields: req.body.fields,
                        startingPositions: req.body.startingPositions,
                        readyToUse: req.body.readyToUse
                    }
        
                    await Map.updateOne(filter, update)
                    return res.status(200).send({status: 'MAP MODIFIED', code: 200, token: check})
                }
                return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
            }
            const filter = {
                _id: map._id
            }
            const update = {
                name: req.body.name,
                size: req.body.size,
                image: req.body.image,
                fields: req.body.fields,
                startingPositions: req.body.startingPositions,
                readyToUse: req.body.readyToUse
            }

            await Map.updateOne(filter, update)
            return res.status(200).send({status: 'MAP MODIFIED', code: 200})
        }
        return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Validates data sent by user to log in
 * @param {object} req contains email, token, refreshToken of user which want to edit and id and name (new one) of map to edit
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        size: Joi.string().required(),
        image: Joi.string().required(),
        fields: Joi.array().required(),
        startingPositions: Joi.array().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router