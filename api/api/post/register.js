const express = require('express')
const router = express.Router()
const { User } = require('../../models/user')
const _ = require('lodash')
const Joi = require('joi')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const nodemailer = require('nodemailer')
const salt = 10

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
        return res.status(400).send({status: 'USER FOUND', code: 400})
    }
})

async function sendConfirmationEmail(data){
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.CONFIRMATION_EMAIL,
            pass: process.env.CONFIRMATION_EMAIL_PASSWORD
        }
    })

    var mailOptions = {
        from: process.env.CONFIRMATION_EMAIL,
        to: data.email,
        subject: `${process.env.GAME_NAME} email confirmation`,
        html: `<p>Please confirm your email by clicking this <a href="${process.env.SERVER_ADDRESS}authorize?email=${data.email}&accessToken=${data.accessToken}">link</a>.</p>`
    }
      
    transporter.sendMail(mailOptions, function(error, info){
        if (error) {
            console.log(error)
        } else {
            console.log(info)
        }
    })
}

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
        bans: []
    }, ['username', 'email', 'password', 'token', 'refreshToken', 'accessToken', 'confirmed', 'admin', 'bans']))
    await newUser.save()
    return {status: 'OK', code: 200, token, refreshToken, accessToken, username: body.username, email: body.email}
}

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
        repeatPassword: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router