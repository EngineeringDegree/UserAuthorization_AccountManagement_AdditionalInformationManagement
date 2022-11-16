const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { statuses } = require('../../../utils/enums/status')

/*
Checks if user exists
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    try {
        const user = await User.findOne({ _id: req.query.id })
        if (user) {
            return res.status(200).send({ status: statuses.USERS_FOUND, code: 200, userReturned: true, username: user.username, email: user.email })
        }
    } catch (e) {
        return res.status(500).send({ status: statuses.SOMETHING_WENT_WRONG, code: 500 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, userReturned: false })
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