const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
This middleware checks if can matchmake two players. If can it returns info about users
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA' })
    }

    if (req.query.gameApiSecret != process.env.GAME_API_SECRET) {
        return res.status(401).send({ status: 'BAD SECRET KEY', code: 401, action: 'BAD SECRET KEY' })
    }

    const user1 = await User.findOne({ email: req.query.player1 })
    const user2 = await User.findOne({ email: req.query.player2 })
    if (!user1 || !user2) {
        return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'USER NOT FOUND' })
    }

    if (checkIfBanned(user1) || checkIfBanned(user2)) {
        return res.status(401).send({ status: 'USER IS BANNED', code: 401, action: 'USER IS BANNED' })
    }

    return res.status(200).send({ status: 'USERS FOUND', code: 200, action: 'USERS FOUND', user1: user1._id, user2: user2._id })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        player1: Joi.string().email().required(),
        player2: Joi.string().email().required(),
        gameApiSecret: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router