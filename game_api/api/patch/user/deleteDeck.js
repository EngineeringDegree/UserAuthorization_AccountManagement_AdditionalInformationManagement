const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Deck } = require('../../../models/deck')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware for deleteing decks
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    let decks = await Deck.find({ owner: req.body.email, deleted: false })
    if (decks.length > 1) {
        let deck = undefined
        try {
            deck = await Deck.findOne({ _id: req.body.deckId })
        } catch (e) { }
        if (deck) {
            if (deck.owner == req.body.email) {
                const filter = {
                    _id: deck._id
                }
                const update = {
                    deleted: true
                }

                try {
                    await Deck.updateOne(filter, update)
                } catch (e) { }
                decks = await Deck.find({ owner: req.body.email, deleted: false }).select('_id name nation')
                let decksToReturn = []
                for (let i = 0; i < decks.length; i++) {
                    let nation = undefined
                    try {
                        nation = await Card_Nation.findOne({ _id: decks[i].nation, readyToUse: true })
                    } catch (e) { }
                    if (nation) {
                        decksToReturn.push({
                            _id: decks[i]._id,
                            nation: nation.name,
                            name: decks[i].name
                        })
                    }
                }

                return res.status(200).send({ status: 'DECK REMOVED', code: 200, action: 'CHANGE DECK LIST ACCORDINGLY', decks: decksToReturn })
            }

            return res.status(401).send({ status: 'YOU ARE NOT AN OWNER', code: 404, action: 'REDIRECT TO MAIN SCREEN' })
        }
    }

    decks = await Deck.find({ owner: req.body.email, deleted: false }).select('_id name nation')
    return res.status(401).send({ status: 'DECK NOT FOUND, YOU CANNOT DELETE IT', code: 404, action: 'CHANGE DECK LIST ACCORDINGLY', decks: decks })
})

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
        deckId: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router