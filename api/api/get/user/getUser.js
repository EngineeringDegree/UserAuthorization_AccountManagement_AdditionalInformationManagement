const express = require('express')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
Middleware which sends users specified in parameters. 
*/
router.get('/', async (req, res) => {
    let user = await User.findOne({ email: req.query.email })
    if(user){
        if(checkIfBanned(user)){
            return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
        }
        var check = checkToken(user.token, req.query.token)
        if(!check){
            check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
            if(check){
                var userToFind = await User.findOne({ _id: req.query.id })
                if(userToFind){
                    if(user.email == userToFind.email){
                        return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND EDIT FORM', token: check, username: userToFind.username, id: userToFind._id, email: userToFind.email })
                    }

                    if(user.admin){
                        return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND BANHAMMER', token: check, username: userToFind.username, id: userToFind._id })
                    }

                    return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO', token: check, username: userToFind.username })
                }
                return res.status(404).send({ status: "USER NOT FOUND", action: "GO TO USERS" })
            }
            return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
        }
        var userToFind = await User.findOne({ _id: req.query.id })
        if(userToFind){
            if(user.email == userToFind.email){
                return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND EDIT FORM', username: userToFind.username, id: userToFind._id, email: userToFind.email })
            }

            if(user.admin){
                return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO AND BANHAMMER', username: userToFind.username, id: userToFind._id })
            }
            return res.status(200).send({status: 'USER FOUND', code: 200, action: 'DISPLAY USER INFO', username: userToFind.username })
        }
        return res.status(404).send({ status: "USER NOT FOUND", action: "GO TO USERS" })
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

module.exports = router