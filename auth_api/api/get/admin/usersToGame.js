const express = require('express')
const Joi = require('joi')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware checks if can matchmake two players. If can it returns info about users
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA })
    }

    if (req.query.gameApiSecret != process.env.GAME_API_SECRET) {
        return res.status(401).send({ status: statuses.BAD_SECRET_KEY, code: 401, action: actions.BAD_SECRET_KEY })
    }

    const user1 = await User.findOne({ email: req.query.player1 })
    const user2 = await User.findOne({ email: req.query.player2 })
    if (!user1 || !user2) {
        return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.USER_NOT_FOUND })
    }

    if (checkIfBanned(user1) || checkIfBanned(user2)) {
        return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401, action: actions.USER_IS_BANNED })
    }

    return res.status(200).send({ status: statuses.USERS_FOUND, code: 200, action: actions.USERS_FOUND, user1: user1._id, user2: user2._id })
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