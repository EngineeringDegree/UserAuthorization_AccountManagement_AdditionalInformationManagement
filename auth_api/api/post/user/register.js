const express = require('express')
const config = require('config')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const { sendConfirmationEmail } = require('../../../utils/emails/user_emails')
const { User } = require('../../../models/user')
const { Token } = require('../../../models/token')
const { statuses } = require('../../../utils/enums/status')
const salt = 10

// Middleware to registration
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (req.body.password != req.body.repeatPassword) {
        return res.status(401).send({ status: statuses.PASSWORDS_DO_NOT_MATCH, code: 401 })
    }

    const user = await User.findOne({ email: req.body.email })
    if (user) {
        return res.status(406).send({ status: statuses.USER_FOUND, code: 406 })
    }

    let data
    if (await User.countDocuments() == 0) {
        data = await putAdmin(req.body)
    } else {
        data = await putUser(req.body)
    }

    if (data.code == 200) {
        sendConfirmationEmail(data)
    }

    return res.status(data.code).send(data)
})

/**
 * Puts new admin account to database
 * @param {object} body contains user email, username and password to hash 
 * @returns object with status, code, tokens, username and email
 */
async function putAdmin(body) {
    const pass = await bcrypt.hash(body.password, salt)
    let newUser = new User(_.pick({
        username: body.username,
        email: body.email,
        password: pass,
        confirmed: false,
        admin: true,
        bans: [],
        funds: 1000
    }, ['username', 'email', 'password', 'confirmed', 'admin', 'bans', 'funds']))
    try {
        await newUser.save()
    } catch (e) {
        return { status: statuses.SOMETHING_WENT_WRONG, code: 500 }
    }

    if (newUser._id) {
        const token = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'), { expiresIn: '1h' })
        let newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.AUTHORIZATION,
            token: token,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }

        const refreshToken = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'), { expiresIn: '60d' })
        newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.REFRESH,
            token: refreshToken,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }

        const accessToken = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'))
        newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.ACCESS,
            token: accessToken,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }
        return { status: statuses.OK, code: 200, token, refreshToken, accessToken, username: body.username, email: body.email, authorizationAddress: body.authorizationAddress, id: newUser._id, funds: 0 }
    }

    return { status: statuses.SOMETHING_WENT_WRONG, code: 500 }
}

/**
 * Puts new user account to database
 * @param {object} body contains user email, username and password to hash 
 * @returns object with status, code, tokens, username and email
 */
async function putUser(body) {
    const pass = await bcrypt.hash(body.password, salt)

    let newUser = new User(_.pick({
        username: body.username,
        email: body.email,
        password: pass,
        confirmed: false,
        admin: false,
        bans: [],
        funds: 1000
    }, ['username', 'email', 'password', 'confirmed', 'admin', 'bans', 'funds']))
    try {
        await newUser.save()
    } catch (e) {
        return { status: statuses.SOMETHING_WENT_WRONG, code: 500 }
    }

    if (newUser._id) {
        const token = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'), { expiresIn: '1h' })
        let newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.AUTHORIZATION,
            token: token,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }

        const refreshToken = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'), { expiresIn: '60d' })
        newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.REFRESH,
            token: refreshToken,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }

        const accessToken = jwt.sign({ _id: newUser._id }, config.get('PrivateKey'))
        newToken = new Token(_.pick({
            owner: newUser._id,
            type: process.env.ACCESS,
            token: accessToken,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) { }
        return { status: statuses.OK, code: 200, token, refreshToken, accessToken, username: body.username, email: body.email, authorizationAddress: body.authorizationAddress, id: newUser._id, funds: 0 }
    }

    return { status: statuses.SOMETHING_WENT_WRONG, code: 500 }
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
        repeatPassword: Joi.string().required(),
        authorizationAddress: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router