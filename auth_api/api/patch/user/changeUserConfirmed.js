const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { User } = require('../../../models/user')

// Middleware for changing user confirmation status
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400})
    }

    let user = await User.findOne({ email: req.body.email })
    if(user){
        if(checkIfBanned(user)){
            return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
        }

        var check = checkToken(user.token, req.body.token)
        if(!check){
            check = await askNewToken(user.refreshToken, req.body.refreshToken, user)
            if(check){
                await changeUserConfirmed(req.body.user, req.body.confirmed)
                return res.status(200).send({ status: "ACCOUNT CONFIRMED", code: 200, confirmed: req.body.confirmed, token: check })
            }
            return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
        }
        
        await changeUserConfirmed(req.body.user, req.body.confirmed)
        return res.status(200).send({ status: "ACCOUNT CONFIRMED", code: 200, confirmed: req.body.confirmed })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: "LOGOUT" })
})

/**
 * Changes user username to username variable value
 * @param {string} id of user to alter
 * @param {bool} confirmed
 */
async function changeUserConfirmed(id, confirmed){
    const filter = {
        _id: id
    }
    const update = {
        confirmed: confirmed
    }

    await User.updateOne(filter, update)
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        confirmed: Joi.bool().required(),
        user: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router