const express = require('express')
const router = express.Router()
const { User } = require('../../models/user')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcrypt')
const Joi = require('joi')

router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400})
    }

    let user = await User.findOne({ 'email': { $regex : new RegExp(req.body.email, 'i') } })

    if(user){
        var pass = await bcrypt.compare(req.body.password, user.password)
        if(pass){
            const refreshToken = jwt.sign({ _id: user._id }, config.get('PrivateKey'), {expiresIn: '60d' })
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), {expiresIn: '1h' })
            const filter = {
                _id: user._id
            }
            const update = {
                refreshToken: refreshToken,
                token: token
            }

            await User.updateOne(filter, update)

            return res.status(200).send({status: 'OK', code: 200, token, refreshToken})
        }
        
        return res.status(401).send({status: 'BAD DATA', code: 401})
    }

    return res.status(400).send({status: 'USER FOUND', code: 400})
})

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().max(100).required(),
        password: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router