const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const bcrypt = require('bcrypt')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { sendConfirmationEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')

// Middleware for changing user username
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
        
        var pass = await bcrypt.compare(req.body.password, user.password)
        if(pass){
            var alreadyExists = await changeUserEmail(user._id, req.body.newEmail)
            if(alreadyExists) {
                return res.status(409).send({ status: "EMAIL ALREADY REGISTERED", code: 409 })
            }

            sendConfirmationEmail({ email: req.body.newEmail, accessToken: user.accessToken })
            return res.status(200).send({ status: "EMAIL CHANGED", code: 200, email: req.body.newEmail })
        }
        return res.status(401).send({status: 'PASSWORD NOT MATCH', code: 401})
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: "LOGOUT" })
})

/**
 * Changes user username to username variable value
 * @param {string} id of user to alter
 * @param {string} email new email of an user 
 */
async function changeUserEmail(id, email){
    let user = await User.findOne({ email: email })

    if(user){
        return true
    }
    
    const filter = {
        _id: id
    }
    const update = {
        email: email,
        confirmed: false
    }

    await User.updateOne(filter, update)
    return false
}

/**
 * Validates data sent by user to change his username
 * @param {object} req object
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        newEmail: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router