const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const axios = require('axios')
const { Pack } = require('../../../models/packs')
const { UserCard } = require('../../../models/user_cards')
const { Deck } = require('../../../models/deck')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware for opening pack, patching user card collection and creating basic deck if there isn't something like that
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        try {
            var pack = await Pack.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (pack) {
            const filter = {
                _id: pack._id
            }
            const update = {
                used: true
            }

            await Pack.updateOne(filter, update)
            var cardsInPack = pack.cards
            var userCards = await UserCard.findOne({ owner: req.body.email })
            if (userCards) {
                var cards = userCards.cards
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
                await UserCard.updateOne(filter2, update2)
            } else {
                var cards = []
                for (let i = 0; i < cardsInPack.length; i++) {
                    cards.push({ _id: cardsInPack[i]._id, quantity: cardsInPack[i].basicDeck })
                }

                var newCardsCollection = new UserCard(_.pick({
                    owner: req.body.email,
                    cards: cards
                }, ['owner', 'cards']))
                await newCardsCollection.save()
            }

            let decks = await Deck.find({ owner: req.body.email })
            if (decks.length == 0) {
                await generateBasicDecks(req.body.email, cardsInPack)
            }
            return res.status(200).send({ status: 'PACK OPENED', code: 200, token: res.locals.user.data.token, id: pack._id, cards: cardsInPack })
        }
        return res.status(404).send({ status: 'PACK NOT FOUND', code: 404, action: 'PACK NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Generates decks for user which didn't have any from basic cards.
 * 
 * @param {string} owner email of deck owner 
 * @param {array} cards array of card objects to generate decks from
 */
async function generateBasicDecks(owner, cards) {
    var allNationCards = {
        strength: 0,
        cards: []
    }
    var nationCards = []

    for (let i = 0; i < cards.length; i++) {
        let card = await Card.findOne({ _id: cards[i]._id })

        if (card.nation.length == 1) {
            var nation = await Card_Nation.findOne({ _id: card.nation[0], readyToUse: true })
            if (nation) {
                if (nation.name == 'All') {
                    allNationCards.strength += ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * cards[i].basicDeck)
                    allNationCards.cards.push({ _id: cards[i]._id, quantity: cards[i].basicDeck })
                } else {
                    var nationAlreadyGenerated = false
                    for (let j = 0; j < nationCards.length; j++) {
                        if (nation.name == nationCards[j].nation) {
                            nationAlreadyGenerated = true
                            nationCards[j].strength += ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * cards[i].basicDeck)
                            nationCards[j].cards.push({ _id: cards[i]._id, quantity: cards[i].basicDeck })
                            break
                        }
                    }

                    if (!nationAlreadyGenerated) {
                        nationCards.push({
                            strength: ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * cards[i].basicDeck),
                            cards: [{ _id: cards[i]._id, quantity: cards[i].basicDeck }],
                            nation: nation.name,
                            id: nation._id
                        })
                    }
                }
            }
        } else {
            for (let j = 0; j < card.nation.length; j++) {
                var nation = await Card_Nation.findOne({ _id: card.nation[j], readyToUse: true })
                if (nation) {
                    var nationAlreadyGenerated = false
                    for (let k = 0; k < nationCards.length; k++) {
                        if (nation.name == nationCards[k].nation) {
                            nationAlreadyGenerated = true
                            nationCards[k].strength += ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * cards[i].basicDeck)
                            nationCards[k].cards.push({ _id: cards[i]._id, quantity: cards[i].basicDeck })
                            break
                        }
                    }

                    if (!nationAlreadyGenerated) {
                        nationCards.push({
                            strength: ((card.type.length + card.attack + card.defense + card.mobility + card.effects.length) * cards[i].basicDeck),
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
        var newDeck = new Deck(_.pick({
            owner: owner,
            nation: nationCards[nationCards.length - 1].id,
            cards: nationCards[nationCards.length - 1].cards.concat(allNationCards.cards),
            strength: nationCards[nationCards.length - 1].strength + allNationCards.strength,
            name: `${nationCards[nationCards.length - 1].nation} Starter Deck`,
            deleted: false
        }, ['owner', 'nation', 'cards', 'strength', 'name', 'deleted']))
        await newDeck.save()
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
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router