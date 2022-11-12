const express = require('express')
const router = express.Router()
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const cardsObj = await UserCard.findOne({ owner: req.query.email })
        if (cardsObj) {
            if (res.locals.user.data.token) {
                return res.status(200).send({ status: statuses.OK, code: 200, cards: cardsObj.cards, token: res.locals.user.data.token })
            }

            return res.status(200).send({ status: statuses.OK, code: 200, cards: cardsObj.cards })
        }

        return res.status(404).send({ status: statuses.CARDS_NOT_FOUND, code: 404, action: actions.CARDS_NOT_FOUND_POPUP })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

module.exports = router