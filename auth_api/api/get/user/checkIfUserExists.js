const express = require('express')
const router = express.Router()
const { User } = require('../../../models/user')

/*
Checks if user exists
*/
router.get('/', async (req, res) => {
    let user = await User.findOne({ id: req.query.id })
    if(user){
        return res.status(200).send({status: 'USER FOUND', code: 200, userReturned: true, username: user.username })
    
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT', userReturned: false })
})

module.exports = router