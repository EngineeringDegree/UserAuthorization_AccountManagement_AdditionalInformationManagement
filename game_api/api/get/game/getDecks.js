const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
var { Deck } = require('../../../models/deck')
var { Pack } = require('../../../models/packs')
var { Card } = require('../../../models/card')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.query.email}&token=${req.query.token}&refreshToken=${req.query.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var decks = await Deck.find({ owner: req.query.email }).select('_id name nation strength')
        if (decks.length == 0) {
            var packs = await Pack.find({ owner: req.query.email })
            if (packs.length == 0) {
                await createInvitationalGift(req.query.email)
            } else {
                if (user.data.token) {
                    return res.status(303).send({ status: 'OPEN PACKS FIRST', action: 'REDIRECT TO PACKS PAGE', token: user.data.token, code: 303 })
                }

                return res.status(303).send({ status: 'OPEN PACKS FIRST', action: 'REDIRECT TO PACKS PAGE', code: 303 })
            }
            if (user.data.token) {
                return res.status(303).send({ status: 'FIRST PACKS CREATED', action: 'REDIRECT TO PACKS PAGE', token: user.data.token, code: 303 })
            }

            return res.status(303).send({ status: 'FIRST PACKS CREATED', action: 'REDIRECT TO PACKS PAGE', code: 303 })
        }

        if (user.data.token) {
            return res.status(200).send({ status: 'OK', token: user.data.token, code: 200, decks: decks })
        }

        return res.status(200).send({ status: 'OK', code: 200, decks: decks })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Generates welcome pack
 * @param {string} owner email of owner of new pack
 */
async function createInvitationalGift(owner) {
    var cards = await Card.find({ basicDeck: { $gt: 0 } }).select('_id basicDeck')
    var newPack = new Pack(_.pick({
        owner: owner,
        cards: cards,
        nation: 'All',
        packName: 'Welcome Beginner Pack',
        used: false
    }, ['owner', 'cards', 'nation', 'packName', 'used']))
    await newPack.save()
}

function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router