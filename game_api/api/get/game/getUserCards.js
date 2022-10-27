const express = require('express')
const router = express.Router()
const { UserCard } = require('../../../models/user_cards')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const cardsObj = await UserCard.findOne({ owner: req.query.email })
        if (cardsObj) {
            if (res.locals.user.data.token) {
                return res.status(200).send({ status: 'OK', code: 200, cards: cardsObj.cards, token: res.locals.user.data.token })
            }

            return res.status(200).send({ status: 'OK', code: 200, cards: cardsObj.cards })
        }

        return res.status(404).send({ status: 'CARDS NOT FOUND', code: 404, action: 'CARDS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router