const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
const { selectRandomElementFromArray } = require('../../../utils/random/random')
const { Card } = require('../../../models/card')
const { Pack } = require('../../../models/packs')
const { Shop_Pack } = require('../../../models/shop_pack')

// Middleware for creating a deck
router.post('/', async (req, res) => {
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
        var pack = await Shop_Pack.findOne({ _id: req.body.id })
        if (pack) {
            try {
                var patchObject = {
                    email: req.body.email,
                    token: req.body.token,
                    refreshToken: req.body.refreshToken,
                    price: pack.price
                }

                var funds = await axios.patch(`${process.env.AUTH_SERVER}/patch/user/funds`, patchObject)
            } catch (e) {
                return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
            }
            if (funds.data) {
                var cards = await Card.find({ readyToUse: true })
                var cardsToUse = []
                if (pack.nation != "All") {
                    for (let i = 0; i < cards.length; i++) {
                        for (let j = 0; j < cards[i].nation.length; j++) {
                            if (cards[i].nation[j] == pack.nation || cards[i].nation[j] == 'All') {
                                cardsToUse.push(cards[i])
                                break
                            }
                        }
                    }
                } else {
                    cardsToUse = cards
                }

                var cardsChoosen = []

                for (let i = 0; i < pack.cardsCount; i++) {
                    var el = selectRandomElementFromArray(cardsToUse.length)
                    var card = cardsToUse[el]
                    var alreadyIn = false
                    for (let j = 0; j < cardsChoosen.length; j++) {
                        if (cardsChoosen[j]._id.equals(card._id)) {
                            alreadyIn = true
                            cardsChoosen[j].basicDeck += 1
                            break
                        }
                    }

                    if (!alreadyIn) {
                        cardsChoosen.push({
                            _id: card._id,
                            basicDeck: 1
                        })
                    }
                }
                await createPack(cardsChoosen, req.body.email, pack.nation, pack.name)

                return res.status(200).send({ status: 'PACK BOUGHT', code: 200 })
            }
            return res.status(400).send({ status: 'INSUFFICIENT FUNDS', code: 400, action: 'INSUFFICIENT FUNDS POPUP' })
        }
        return res.status(404).send({ status: 'SHOP PACK NOT FOUND', code: 404 })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Save pack with following arguments
 * @param {array} cards to save 
 * @param {String} owner to save 
 * @param {String} nation to save 
 * @param {String} packName to save 
 */
async function createPack(cards, owner, nation, packName) {
    var newPack = new Pack(_.pick({
        packName: packName,
        nation: nation,
        cards: cards,
        owner: owner,
        used: false
    }, ['packName', 'nation', 'cards', 'owner', 'used']))
    await newPack.save()
}

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
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router