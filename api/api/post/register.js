const express = require('express')
const router = express.Router()
const { User } = require('../../models/user')
const _ = require('lodash')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const salt = 10

router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400})
    }

    if(req.body.password != req.body.repeatPasword){
        return res.status(400).send({status: 'PASSWORDS DO NOT MATCH', code: 400})
    }

    let user = await User.findOne({ 'email': { $regex : new RegExp(req.body.email, 'i') } })
    
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
        return res.status(400).send({status: 'USER FOUND', code: 400})
    }
})

async function sendConfirmationEmail(data){

}

async function putAdmin(body){
    var pass = await bcrypt.hash(body.password, salt)
    const token = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '1h' })
    const refreshToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d' })
    const accessToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d'})
    var newUser = new User(_.pick({
        username: body.username,
        email: body.email, 
        password: pass,
        token,
        refreshToken,
        accessToken,
        confirmed: false,
        admin: true,
        bans: []
    }, ['username', 'email', 'password', 'token', 'refreshToken', 'accessToken', 'confirmed', 'admin', 'bans']))
    await newUser.save()
    return {status: 'OK', code: 200, token, refreshToken, accessToken, username: body.username, email: body.email}
}

async function putUser(body){
    var pass = await bcrypt.hash(body.password, salt)
    const token = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '1h' })
    const refreshToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d' })
    const accessToken = jwt.sign({ email: body.email, username: body.username }, config.get('PrivateKey'), {expiresIn: '60d'})
    var newUser = new User(_.pick({
        username: body.username,
        email: body.email, 
        password: pass,
        token,
        refreshToken,
        accessToken,
        confirmed: false,
        admin: false,
        bans: []
    }, ['username', 'email', 'password', 'token', 'refreshToken', 'accessToken', 'confirmed', 'admin', 'bans']))
    await newUser.save()
    return {status: 'OK', code: 200, token, refreshToken, accessToken, username: body.username, email: body.email}
}

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().max(100).required(),
        username: Joi.string().max(50).required(),
        password: Joi.string().required(),
        repeatPasword: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router