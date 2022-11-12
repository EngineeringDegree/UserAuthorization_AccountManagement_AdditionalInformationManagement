const express = require('express')
const router = express.Router()
const _ = require('lodash')
const { checkDeckStrengthAndUpdate } = require('../../../utils/deck/checkStrengthAndUpdate')
const { checkIfDeckOk } = require('../../../utils/deck/checkIfDeckIsOk')
const { Deck } = require('../../../models/deck')
const { Pack } = require('../../../models/packs')
const { Card } = require('../../../models/card')
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const decks = await Deck.find({ owner: req.query.email, deleted: false }).select('_id name nation strength')
        if (decks.length == 0) {
            const packs = await Pack.find({ owner: req.query.email })
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

        let decksToReturn = []
        for (let i = 0; i < decks.length; i++) {
            let nation = undefined
            try {
                nation = await Card_Nation.findOne({ _id: decks[i].nation, readyToUse: true })
            } catch (e) { }
            if (nation) {
                const strength = await checkDeckStrengthAndUpdate(decks[i]._id)
                const allOk = await checkIfDeckOk(decks[i]._id)
                if (allOk) {
                    decksToReturn.push({
                        _id: decks[i]._id,
                        nation: nation.name,
                        name: decks[i].name,
                        strength: strength
                    })
                }
            }
        }

        return res.status(200).send({ status: statuses.OK, code: 200, decks: decksToReturn, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Generates welcome pack
 * @param {string} owner email of owner of new pack
 */
async function createInvitationalGift(owner) {
    const cards = await Card.find({ basicDeck: { $gt: 0 }, readyToUse: true }).select('_id basicDeck')
    let newPack = new Pack(_.pick({
        owner: owner,
        cards: cards,
        nation: 'All',
        packName: 'Welcome Beginner Pack',
        used: false
    }, ['owner', 'cards', 'nation', 'packName', 'used']))
    try {
        await newPack.save()
    } catch (e) { }
}

module.exports = router