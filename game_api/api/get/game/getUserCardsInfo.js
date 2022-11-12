const express = require('express')
const router = express.Router()
const { UserCard } = require('../../../models/user_cards')
const { Card_Nation } = require('../../../models/card_nation')
const { Card } = require('../../../models/card')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const cardsObj = await UserCard.findOne({ owner: req.query.email })
        if (cardsObj) {
            const cards = cardsObj.cards
            let cardsFiltered = []
            for (let i = 0; i < cards.length; i++) {
                let card = undefined
                try {
                    card = await Card.findOne({ _id: cards[i]._id })
                } catch (e) { }
                if (card) {
                    let nations = []
                    let nationsReady = []
                    for (let j = 0; j < card.nation.length; j++) {
                        let nation = undefined
                        try {
                            nation = await Card_Nation.findOne({ _id: card.nation, readyToUse: true })
                        } catch (e) { }
                        if (nation) {
                            let nameFound = false
                            for (let k = 0; k < nations.length; k++) {
                                if (nations[k] == nation.name) {
                                    nameFound = true
                                    break
                                }
                            }

                            if (!nameFound) {
                                nations.push(nation.name)
                                nationsReady.push(nation.readyToUse)
                            }
                        }
                    }
                    cardsFiltered.push({ card: card, quantity: cards[i].quantity, nations: nations, nationsReady: nationsReady })
                }
            }

            return res.status(200).send({ status: statuses.OK, code: 200, cards: cardsFiltered, token: res.locals.user.data.token })
        }

        return res.status(404).send({ status: 'CARDS NOT FOUND', code: 404, action: 'CARDS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

module.exports = router