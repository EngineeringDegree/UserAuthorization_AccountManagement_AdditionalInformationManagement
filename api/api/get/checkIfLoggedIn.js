const express = require('express')
const router = express.Router()
const { User } = require('../../models/user')
const { checkToken, askNewToken } = require('../../utils/token')

router.get('/', async (req, res) => {
    let user = await User.findOne({ email: req.query.email })
    if(user){
        var check = checkToken(user.token, req.query.token)
        if(!check){
            check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
            if(check){
                return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN', token: check})
            }
            return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
        }
        return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN'})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

module.exports = router