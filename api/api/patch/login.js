const express = require('express')
const config = require('config')
const router = express.Router()
const jwt = require('jsonwebtoken')
const bcrypt = require('bcrypt')
const Joi = require('joi')
const { User } = require('../../models/user')

// Middleware for login user
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400})
    }

    let user = await User.findOne({ email: req.body.email })

    if(user){
        var pass = await bcrypt.compare(req.body.password, user.password)
        if(pass){
            var refreshTokens = user.refreshToken
            var tokens = user.token
            const refreshToken = jwt.sign({ _id: user._id }, config.get('PrivateKey'), {expiresIn: '60d' })
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), {expiresIn: '1h' })
            refreshTokens.push(refreshToken)
            tokens.push(token)
            const filter = {
                _id: user._id
            }
            const update = {
                refreshToken: refreshTokens,
                token: tokens
            }

            await User.updateOne(filter, update)

            return res.status(200).send({status: 'OK', code: 200, token, refreshToken})
        }
        
        return res.status(401).send({status: 'BAD DATA', code: 401})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404})
})

/**
 * Validates data sent by user to log in
 * @param {object} req contains email and password of user which want to log in
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router