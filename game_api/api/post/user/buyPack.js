const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const axios = require('axios')
const { selectRandomElementFromArray } = require('../../../utils/random/random')
const { Card } = require('../../../models/card')
const { Pack } = require('../../../models/packs')
const { Card_Nation } = require('../../../models/card_nation')
const { Shop_Pack } = require('../../../models/shop_pack')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a deck
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        if (res.locals.user.data.confirmed) {
            let pack = undefined
            try {
                pack = await Shop_Pack.findOne({ _id: req.body.id })
            } catch (e) { }
            if (pack) {
                let funds = undefined
                try {
                    const patchObject = {
                        email: req.body.email,
                        token: req.body.token,
                        refreshToken: req.body.refreshToken,
                        price: pack.price,
                        gameApiSecret: process.env.GAME_API_SECRET
                    }

                    funds = await axios.patch(`${process.env.AUTH_SERVER}/patch/user/funds`, patchObject)
                } catch (e) {
                    return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code })
                }
                if (funds.data) {
                    const cards = await Card.find({ readyToUse: true })
                    let packNation = undefined
                    try {
                        packNation = await Card_Nation.find({ _id: pack.nation, readyToUse: true })
                    } catch (e) { }
                    var cardsToUse = []

                    if (!packNation) {
                        try {
                            const patchObject = {
                                email: req.body.email,
                                token: req.body.token,
                                refreshToken: req.body.refreshToken,
                                refund: pack.price,
                                gameApiSecret: process.env.GAME_API_SECRET
                            }

                            funds = await axios.patch(`${process.env.AUTH_SERVER}/patch/user/refund`, patchObject)
                        } catch (e) {
                            return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code })
                        }

                        return res.status(404).send({ status: statuses.THAT_NATION_IS_TURNED_OFF, code: 404 })
                    }


                    for (let i = 0; i < cards.length; i++) {
                        for (let j = 0; j < cards[i].nation.length; j++) {
                            let nation = undefined
                            try {
                                nation = await Card_Nation.find({ _id: cards[i].nation })
                            } catch (e) { }
                            if (nation.name == packNation.name) {
                                cardsToUse.push(cards[i])
                                break
                            }
                        }
                    }


                    if (cardsToUse.length == 0) {
                        try {
                            const patchObject = {
                                email: req.body.email,
                                token: req.body.token,
                                refreshToken: req.body.refreshToken,
                                refund: pack.price,
                                gameApiSecret: process.env.GAME_API_SECRET
                            }

                            funds = await axios.patch(`${process.env.AUTH_SERVER}/patch/user/refund`, patchObject)
                        } catch (e) {
                            return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code })
                        }

                        return res.status(404).send({ status: statuses.CARDS_IN_NATION_NOT_FOUND, code: 404 })
                    }

                    let cardsChoosen = []
                    for (let i = 0; i < pack.cardsCount; i++) {
                        let el = selectRandomElementFromArray(cardsToUse.length)
                        let card = cardsToUse[el]
                        let alreadyIn = false
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
                    await createPack(cardsChoosen, req.body.userId, pack.nation, pack.name)

                    return res.status(200).send({ status: statuses.PACK_BOUGHT, code: 200 })
                }
                return res.status(400).send({ status: statuses.INSUFFICIENT_FUNDS, code: 400 })
            }

            return res.status(404).send({ status: statuses.SHOP_PACK_NOT_FOUND, code: 404 })
        }
        return res.status(401).send({ status: statuses.ACCOUNT_NOT_CONFIRMED, code: 401 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save pack with following arguments
 * @param {array} cards to save 
 * @param {String} owner to save 
 * @param {String} nation to save 
 * @param {String} packName to save 
 */
async function createPack(cards, owner, nation, packName) {
    let newPack = new Pack(_.pick({
        packName: packName,
        nation: nation,
        cards: cards,
        owner: owner,
        used: false
    }, ['packName', 'nation', 'cards', 'owner', 'used']))
    try {
        await newPack.save()
    } catch (e) { }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        userId: Joi.string().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router