const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Shop_Pack } = require('../../../models/shop_pack')
const { statuses } = require('../../../utils/enums/status')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        await createPack(req.body)
        return res.status(200).send({ status: statuses.SHOP_PACK_CREATED, code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Save map with following arguments
 * @param {object} pack to save 
 */
async function createPack(pack) {
    let newPack = new Shop_Pack(_.pick({
        name: pack.name,
        cardsCount: pack.cardsCount,
        nation: pack.nation,
        price: pack.price,
        readyToUse: false
    }, ['name', 'cardsCount', 'nation', 'price', 'readyToUse']))
    try {
        await newPack.save()
    } catch (e) { }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothing if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        cardsCount: Joi.number().required(),
        price: Joi.number().required(),
        nation: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router