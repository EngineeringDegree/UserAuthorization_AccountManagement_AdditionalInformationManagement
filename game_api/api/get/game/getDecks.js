const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { checkDeckStrengthAndUpdate } = require('../../../utils/deck/checkStrengthAndUpdate')
const { Deck } = require('../../../models/deck')
const { Pack } = require('../../../models/packs')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        var decks = await Deck.find({ owner: req.query.email, deleted: false }).select('_id name nation strength')
        if (decks.length == 0) {
            var packs = await Pack.find({ owner: req.query.email })
            if (packs.length == 0) {
                await createInvitationalGift(req.query.email)
            } else {
                if (res.locals.user.data.token) {
                    return res.status(303).send({ status: 'OPEN PACKS FIRST', action: 'REDIRECT TO PACKS PAGE', token: res.locals.user.data.token, code: 303 })
                }

                return res.status(303).send({ status: 'OPEN PACKS FIRST', action: 'REDIRECT TO PACKS PAGE', code: 303 })
            }
            if (res.locals.user.data.token) {
                return res.status(303).send({ status: 'FIRST PACKS CREATED', action: 'REDIRECT TO PACKS PAGE', token: res.locals.user.data.token, code: 303 })
            }

            return res.status(303).send({ status: 'FIRST PACKS CREATED', action: 'REDIRECT TO PACKS PAGE', code: 303 })
        }
        var decksToReturn = []
        for (let i = 0; i < decks.length; i++) {
            var nation = await Card_Nation.findOne({ _id: decks[i].nation, readyToUse: true })
            if (nation) {
                var strength = await checkDeckStrengthAndUpdate(decks[i]._id)
                decksToReturn.push({
                    _id: decks[i]._id,
                    nation: nation.name,
                    name: decks[i].name,
                    strength: strength
                })
            }
        }

        if (res.locals.user.data.token) {
            return res.status(200).send({ status: 'OK', token: res.locals.user.data.token, code: 200, decks: decksToReturn })
        }

        return res.status(200).send({ status: 'OK', code: 200, decks: decksToReturn })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Generates welcome pack
 * @param {string} owner email of owner of new pack
 */
async function createInvitationalGift(owner) {
    var cards = await Card.find({ basicDeck: { $gt: 0 }, readyToUse: true }).select('_id basicDeck')
    var newPack = new Pack(_.pick({
        owner: owner,
        cards: cards,
        nation: 'All',
        packName: 'Welcome Beginner Pack',
        used: false
    }, ['owner', 'cards', 'nation', 'packName', 'used']))
    await newPack.save()
}

module.exports = router