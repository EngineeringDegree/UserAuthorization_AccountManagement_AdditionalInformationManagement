const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')

/*
Checks if user exists
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400 })
    }

    try {
        let user = await User.findOne({ _id: req.query.id })
        if(user){
            return res.status(200).send({status: 'USER FOUND', code: 200, userReturned: true, username: user.username })
        }
    }catch(e){
        return res.status(400).send({status: 'BAD DATA', code: 400 })
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT', userReturned: false })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
 function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router