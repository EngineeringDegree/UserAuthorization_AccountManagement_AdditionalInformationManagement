const express = require('express')
const config = require('config')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendConfirmationEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')
const salt = 10

// Middleware to registration
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400})
    }

    if(req.body.password != req.body.repeatPassword){
        return res.status(400).send({status: 'PASSWORDS DO NOT MATCH', code: 400})
    }

    let user = await User.findOne({ email: req.body.email })
    if(!user){
        var data
        if(await User.countDocuments() == 0){
            data = await putAdmin(req.body)
        }else{
            data = await putUser(req.body)
        }
        sendConfirmationEmail(data)
        return res.status(200).send(data)
    }else{
        return res.status(400).send({ status: 'USER FOUND', code: 400 })
    }
})

/**
 * Puts new admin account to database
 * @param {object} body contains user email, username and password to hash 
 * @returns object with status, code, tokens, username and email
 */
async function putAdmin(body){
    var pass = await bcrypt.hash(body.password, salt)
    const token = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '1h' })
    const refreshToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d' })
    const accessToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'))
    var newUser = new User(_.pick({
        username: body.username,
        email: body.email, 
        password: pass,
        token: [token],
        refreshToken: [refreshToken],
        accessToken,
        confirmed: false,
        admin: true,
        bans: [],
        funds: 0
    }, ['username', 'email', 'password', 'token', 'refreshToken', 'accessToken', 'confirmed', 'admin', 'bans', 'funds']))
    await newUser.save()
    return {status: 'OK', code: 200, token, refreshToken, accessToken, username: body.username, email: body.email, id: newUser._id, funds: 0 }
}

/**
 * Puts new user account to database
 * @param {object} body contains user email, username and password to hash 
 * @returns object with status, code, tokens, username and email
 */
async function putUser(body){
    var pass = await bcrypt.hash(body.password, salt)
    const token = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '1h' })
    const refreshToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d' })
    const accessToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'))
    var newUser = new User(_.pick({
        username: body.username,
        email: body.email, 
        password: pass,
        token: [token],
        refreshToken: [refreshToken],
        accessToken,
        confirmed: false,
        admin: false,
        bans: [],
        funds: 0
    }, ['username', 'email', 'password', 'token', 'refreshToken', 'accessToken', 'confirmed', 'admin', 'bans', 'funds']))
    await newUser.save()
    return {status: 'OK', code: 200, token, refreshToken, accessToken, username: body.username, email: body.email, id: newUser._id, funds: 0 }
}

/**
 * Validates data sent by user
 * @param {object} req object with email, username, password and repeatPassword
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        username: Joi.string().max(50).required(),
        password: Joi.string().required(),
        repeatPassword: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router