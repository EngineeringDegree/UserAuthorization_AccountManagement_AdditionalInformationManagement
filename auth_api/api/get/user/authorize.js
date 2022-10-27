const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')

/*
Checks if user exists
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    let data
    if (error) {
        data = {
            text: 'Bad data',
            code: 400,
            status: 'BAD DATA'
        }
        return res.status(data.code).render('pages/authorize', { data: data, address: process.env.CLASH_OF_MYTHS })
    }

    const user = await User.findOne({ email: req.query.email })
    if (user) {
        if (req.query.accessToken == user.accessToken) {
            if (!user.confirmed) {
                const filter = {
                    _id: user._id
                }
                const update = {
                    confirmed: true
                }
                try {
                    const result = await User.updateOne(filter, update)
                } catch (e) { }
                data = {
                    text: 'Address confirmed',
                    code: 200,
                    status: 'ACCOUNT CONFIRMED'
                }
            } else {
                data = {
                    text: 'Address already confirmed',
                    code: 400,
                    status: 'ACCOUNT ALREADY CONFIRMED'
                }
            }
        } else {
            data = {
                text: 'Bad token',
                code: 400,
                status: 'BAD TOKEN'
            }
        }
    } else {
        data = {
            text: 'User not found',
            code: 404,
            status: 'USER NOT FOUND'
        }
    }
    return res.status(data.code).render('pages/authorize', { data: data, address: process.env.CLASH_OF_MYTHS })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        accessToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router