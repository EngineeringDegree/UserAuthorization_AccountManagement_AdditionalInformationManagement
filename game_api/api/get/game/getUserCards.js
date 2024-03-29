const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        const cardsObj = await UserCard.findOne({ owner: res.locals.user.data.id })
        if (cardsObj) {
            if (res.locals.user.data.token) {
                return res.status(200).send({ status: statuses.OK, code: 200, cards: cardsObj.cards, token: res.locals.user.data.token })
            }

            return res.status(200).send({ status: statuses.OK, code: 200, cards: cardsObj.cards })
        }

        return res.status(404).send({ status: statuses.CARDS_NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router