const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { checkIfUserHasCard } = require('../../../utils/deck/checkIfUserHasCard')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { addPlayer } = require('../../../utils/matchmaking/matchmaking')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Rating } = require('../../../models/rating')
const { Card_Nation } = require('../../../models/card_nation')
const { UserCard } = require('../../../models/user_cards')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.LOGOUT })
    }

    if (res.locals.user.data) {
        if (res.locals.user.data.confirmed) {
            let deck = undefined
            try {
                deck = await Deck.findOne({ _id: req.body.userDeck, deleted: false })
            } catch (e) { }
            if (deck) {
                if (deck.owner == req.body.email) {
                    let nation = undefined
                    try {
                        nation = await Card_Nation.findOne({ _id: deck.nation, readyToUse: true })
                    } catch (e) { }
                    if (!nation) {
                        return res.status(401).send({ status: statuses.THAT_NATION_IS_TURNED_OFF, code: 401, action: actions.CHANGE_DECKS_LIST })
                    }
                    let strength = 0
                    const userCards = await UserCard.findOne({ owner: req.body.email })
                    for (let i = 0; i < deck.cards.length; i++) {
                        let card = undefined
                        try {
                            card = await Card.findOne({ _id: deck.cards[i]._id, readyToUse: true })
                        } catch (e) { }
                        if (!card) {
                            return res.status(401).send({ status: statuses.THAT_CARD_IS_TURNED_OFF, code: 401, action: actions.DISPLAY_CHANGE_YOUR_DECK_POPUP })
                        }

                        if (!card.nation.includes(deck.nation)) {
                            return res.status(401).send({ status: statuses.NATION_NOT_FOUND_IN_CARD, code: 401, action: actions.DISPLAY_CHANGE_YOUR_DECK_POPUP })
                        }

                        if (!checkIfUserHasCard(card, userCards, deck.cards[i].quantity)) {
                            return res.status(401).send({ status: statuses.USER_DO_NOT_HAVE_CARD, code: 401, action: actions.DISPLAY_CHANGE_YOUR_DECK_POPUP })
                        }
                        strength += calculateCardsStrength(card, deck.cards[i].quantity)
                    }

                    if (strength != deck.strength) {
                        const filter = {
                            _id: deck._id
                        }
                        const update = {
                            strength: strength
                        }

                        try {
                            await Deck.updateOne(filter, update)
                        } catch (e) { }
                    }

                    const rating = await Rating.findOne({ owner: req.body.email, nation: deck.nation })
                    let userRating = 1500
                    if (rating) {
                        userRating = rating.rating
                    } else {
                        let newRating = new Rating(_.pick({
                            owner: req.body.email,
                            nation: deck.nation,
                            rating: 1500
                        }, ['owner', 'nation', 'rating']))
                        try {
                            await newRating.save()
                        } catch (e) {
                            return res.status(500).send({ status: statuses.SOMETHING_WENT_WRONG, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP, token: res.locals.user.data.token })
                        }
                    }
                    const success = addPlayer({
                        id: req.body.socketId,
                        userDeck: req.body.userDeck,
                        email: req.body.email,
                        strength: strength,
                        userRating: userRating,
                        pared: false
                    })

                    if (success) {
                        return res.status(200).send({ status: statuses.OK, code: 200, action: actions.JOIN_QUEUE, token: res.locals.user.data.token })
                    }

                    return res.status(500).send({ status: statuses.SOMETHING_WENT_WRONG, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP, token: res.locals.user.data.token })
                }
                return res.status(401).send({ status: statuses.THAT_IS_NOT_YOUR_DECK, code: 401, action: actions.RELOAD_PAGE })
            }
            return res.status(404).send({ status: statuses.THAT_DECK_DOES_NOT_EXISTS, code: 404, action: actions.RELOAD_PAGE })
        }

        return res.status(401).send({ status: statuses.ACCOUNT_NOT_CONFIRMED, code: 401, action: actions.ACCOUNT_NOT_CONFIRMED_POPUP })
    }
    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 400, action: actions.LOGOUT })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        socketId: Joi.string().required(),
        userDeck: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router