const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { UserCard } = require('../../../models/user_cards')
const { Card_Nation } = require('../../../models/card_nation')
const { Card } = require('../../../models/card')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    if (res.locals.user.data) {
        if (res.locals.user.data.id !== req.query.id) {
            return res.status(401).send({ status: statuses.YOU_ARE_NOT_AN_OWNER, code: 401, action: actions.NOT_AN_OWNER_POPUP })
        }

        const cardsObj = await UserCard.findOne({ owner: req.query.id })
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

        return res.status(406).send({ status: statuses.CARDS_NOT_FOUND, code: 406, action: actions.CARDS_NOT_FOUND_POPUP })
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