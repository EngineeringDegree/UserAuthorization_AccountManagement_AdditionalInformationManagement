const express = require('express')
const router = express.Router()
const Joi = require('joi')
const _ = require('lodash')
const axios = require('axios')
const { Deck } = require('../../../models/deck')
const { Rating } = require('../../../models/rating')
const { addPlayer } = require('../../../utils/matchmaking/matchmaking')

/*
This middleware sends cards according to parameters if user is admin
*/
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.body.email}&token=${req.body.token}&refreshToken=${req.body.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var deck = await Deck.findOne({ _id: req.body.userDeck, deleted: false })
        if (deck) {
            if (deck.owner == req.body.email) {
                var rating = await Rating.findOne({ owner: req.body.email, nation: deck.nation })
                var userRating = 1500
                if (rating) {
                    userRating = rating.rating
                } else {
                    var newRating = new Rating(_.pick({
                        owner: req.body.email,
                        nation: deck.nation,
                        rating: 1500
                    }, ['owner', 'nation', 'rating']))
                    await newRating.save()
                }
                var success = addPlayer({
                    id: req.body.socketId,
                    userDeck: req.body.userDeck,
                    email: req.body.email,
                    strength: deck.strength,
                    userRating: userRating
                })

                if (success) {
                    return res.status(200).send({ status: 'OK', code: 200, action: 'JOIN QUEUE', token: user.data.token })
                }

                return res.status(500).send({ status: 'SOMETHING WENT WRONG', code: 500, action: 'SOMETHING WENT WRONG POPUP', token: user.data.token })
            }
            return res.status(401).send({ status: 'THAT IS NOT YOUR DECK', code: 401, action: 'RELOAD PAGE' })
        }
        return res.status(404).send({ status: 'THAT DECK DOES NOT EXISTS', code: 404, action: 'RELOAD PAGE' })

    }
    return res.status(404).send({ status: 'USER NOT FOUND', code: 400, action: 'LOGOUT' })
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