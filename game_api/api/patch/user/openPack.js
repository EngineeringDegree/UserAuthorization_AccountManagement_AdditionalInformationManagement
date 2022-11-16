const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const { calculateCardsStrength } = require('../../../utils/calculations/calculateCardStrength')
const { Pack } = require('../../../models/packs')
const { UserCard } = require('../../../models/user_cards')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')

// Middleware for opening pack, patching user card collection and creating basic deck if there isn't something like that
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        let pack = undefined
        try {
            pack = await Pack.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
        }
        if (pack) {
            const filter = {
                _id: pack._id
            }
            const update = {
                used: true
            }

            try {
                await Pack.updateOne(filter, update)
            } catch (e) { }
            const cardsInPack = pack.cards
            const userCards = await UserCard.findOne({ owner: req.body.userId })
            if (userCards) {
                let cards = userCards.cards
                for (let i = 0; i < cardsInPack.length; i++) {
                    let foundInCollection = false
                    for (let j = 0; j < cards.length; j++) {
                        if (cardsInPack[i]._id.equals(cards[j]._id)) {
                            cards[j].quantity += cardsInPack[i].basicDeck
                            foundInCollection = true
                            break
                        }
                    }

                    if (!foundInCollection) {
                        cards.push({ _id: cardsInPack[i]._id, quantity: cardsInPack[i].basicDeck })
                    }
                }

                const filter2 = {
                    _id: userCards._id
                }
                const update2 = {
                    cards: cards
                }
                try {
                    await UserCard.updateOne(filter2, update2)
                } catch (e) { }
            } else {
                let cards = []
                for (let i = 0; i < cardsInPack.length; i++) {
                    cards.push({ _id: cardsInPack[i]._id, quantity: cardsInPack[i].basicDeck })
                }

                let newCardsCollection = new UserCard(_.pick({
                    owner: req.body.userId,
                    cards: cards
                }, ['owner', 'cards']))
                try {
                    await newCardsCollection.save()
                } catch (e) { }
            }

            let decks = await Deck.find({ owner: req.body.userId })
            if (decks.length == 0) {
                await generateBasicDecks(req.body.userId, cardsInPack)
            }
            return res.status(200).send({ status: statuses.PACK_OPENED, code: 200, token: res.locals.user.data.token, id: pack._id, cards: cardsInPack })
        }
        return res.status(404).send({ status: statuses.PACK_NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Generates decks for user which didn't have any from basic cards.
 * 
 * @param {string} owner id of deck owner 
 * @param {array} cards array of card objects to generate decks from
 */
async function generateBasicDecks(owner, cards) {
    let nationCards = []

    for (let i = 0; i < cards.length; i++) {
        let card = undefined
        try {
            card = await Card.findOne({ _id: cards[i]._id })
        } catch (e) { }

        if (card.nation.length == 1) {
            let nation = undefined
            try {
                nation = await Card_Nation.findOne({ _id: card.nation[0], readyToUse: true })
            } catch (e) { }
            if (nation) {
                let nationAlreadyGenerated = false
                for (let j = 0; j < nationCards.length; j++) {
                    if (nation.name == nationCards[j].nation) {
                        nationAlreadyGenerated = true
                        nationCards[j].strength += calculateCardsStrength(card, cards[i].basicDeck)
                        nationCards[j].cards.push({ _id: cards[i]._id, quantity: cards[i].basicDeck })
                        break
                    }
                }

                if (!nationAlreadyGenerated) {
                    nationCards.push({
                        strength: calculateCardsStrength(card, cards[i].basicDeck),
                        cards: [{ _id: cards[i]._id, quantity: cards[i].basicDeck }],
                        nation: nation.name,
                        id: nation._id
                    })
                }
            }
        } else {
            for (let j = 0; j < card.nation.length; j++) {
                let nation = undefined
                try {
                    nation = await Card_Nation.findOne({ _id: card.nation[j], readyToUse: true })
                } catch (e) { }
                if (nation) {
                    let nationAlreadyGenerated = false
                    for (let k = 0; k < nationCards.length; k++) {
                        if (nation.name == nationCards[k].nation) {
                            nationAlreadyGenerated = true
                            nationCards[k].strength += calculateCardsStrength(card, cards[i].basicDeck)
                            nationCards[k].cards.push({ _id: cards[i]._id, quantity: cards[i].basicDeck })
                            break
                        }
                    }

                    if (!nationAlreadyGenerated) {
                        nationCards.push({
                            strength: calculateCardsStrength(card, cards[i].basicDeck),
                            cards: [{ _id: cards[i]._id, quantity: cards[i].basicDeck }],
                            nation: nation.name,
                            id: nation._id
                        })
                    }
                }
            }
        }
    }

    do {
        let newDeck = new Deck(_.pick({
            owner: owner,
            nation: nationCards[nationCards.length - 1].id,
            cards: nationCards[nationCards.length - 1].cards,
            strength: nationCards[nationCards.length - 1].strength,
            name: `${nationCards[nationCards.length - 1].nation} Starter Deck`,
            deleted: false
        }, ['owner', 'nation', 'cards', 'strength', 'name', 'deleted']))
        try {
            await newDeck.save()
        } catch (e) { }
        nationCards.pop()
    } while (nationCards.length != 0)
}

/**
 * Validates data sent by user to log in
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        userId: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router