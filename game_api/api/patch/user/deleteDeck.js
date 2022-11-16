const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Deck } = require('../../../models/deck')
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for deleteing decks
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    let decks = await Deck.find({ owner: req.body.id, deleted: false })
    if (decks.length > 1) {
        let deck = undefined
        try {
            deck = await Deck.findOne({ _id: req.body.deckId })
        } catch (e) { }
        if (deck) {
            if (deck.owner == req.body.id) {
                const filter = {
                    _id: deck._id
                }
                const update = {
                    deleted: true
                }

                try {
                    await Deck.updateOne(filter, update)
                } catch (e) { }
                decks = await Deck.find({ owner: req.body.id, deleted: false }).select('_id name nation')
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

                return res.status(200).send({ status: statuses.DECK_REMOVED, code: 200, action: actions.CHANGE_DECK_LIST_ACCORDINGLY, decks: decksToReturn })
            }

            return res.status(401).send({ status: statuses.YOU_ARE_NOT_AN_OWNER, code: 404, action: actions.REDIRECT_TO_MAIN_SCREEN })
        }
    }

    decks = await Deck.find({ owner: req.body.id, deleted: false }).select('_id name nation')
    return res.status(401).send({ status: statuses.DECK_NOT_FOUND, code: 404, action: actions.CHANGE_DECK_LIST_ACCORDINGLY, decks: decks })
})

/**
 * Validates data sent by user to log in
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        deckId: Joi.string().min(1).required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router