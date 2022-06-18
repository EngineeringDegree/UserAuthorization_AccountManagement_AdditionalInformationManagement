const express = require('express')
const router = express.Router()
const { User } = require('../../../models/user')

/*
Checks if user exists
*/
router.get('/', async (req, res) => {
    var data
    let user = await User.findOne({ 'email': { $regex : new RegExp(req.query.email, 'i') } })
    if(user){
        if(req.query.accessToken == user.accessToken){
            if(!user.confirmed){
                const filter = {
                    _id: user._id
                }
                const update = {
                    confirmed : true
                }
                const result = await User.updateOne(filter, update)
                data = {
                    text: 'Address confirmed',
                    code: 200,
                    status: 'ACCOUNT CONFIRMED'
                }
            }else{
                data = {
                    text: 'Address already confirmed',
                    code: 400,
                    status: 'ACCOUNT ALREADY CONFIRMED'
                }
            }
        }else{
            data = {
                text: 'Bad token',
                code: 400,
                status: 'BAD TOKEN'
            }
        }
    }else {
        data = {
            text: 'User not found',
            code: 404,
            status: 'USER NOT FOUND'
        }
    }
    return res.status(data.code).render('pages/authorize', { data: data, address: process.env.CLASH_OF_MYTHS })
})

module.exports = router