const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Deck } = require('../../../models/deck')

// Middleware for deleteing decks
router.patch('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var decks = await Deck.find({ owner: req.body.email, deleted: false })
        if (decks.length > 1) {
            var deck = await Deck.findOne({ _id: req.body.deckId })
            if (deck) {
                if (deck.owner == req.body.email) {
                    const filter = {
                        _id: deck._id
                    }
                    const update = {
                        deleted: true
                    }

                    await Deck.updateOne(filter, update)
                    var decks = await Deck.find({ owner: req.body.email, deleted: false }).select('_id name nation')
                    return res.status(200).send({ status: 'DECK REMOVED', code: 200, action: 'CHANGE DECK LIST ACCORDINGLY', decks: decks })
                }

                return res.status(401).send({ status: 'YOU ARE NOT AN OWNER', code: 404, action: 'REDIRECT TO MAIN SCREEN' })
            }
        }

        var decks = await Deck.find({ owner: req.body.email, deleted: false }).select('_id name nation')
        return res.status(401).send({ status: 'DECK NOT FOUND, YOU CANNOT DELETE IT', code: 404, action: 'CHANGE DECK LIST ACCORDINGLY', decks: decks })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
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