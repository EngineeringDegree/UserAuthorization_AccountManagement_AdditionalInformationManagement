const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Shop_Pack } = require('../../../models/shop_pack')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for patching shop packs
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    if (res.locals.user.data) {
        let pack = undefined
        try {
            pack = await Shop_Pack.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
        }
        if (pack) {
            const filter = {
                _id: pack._id
            }
            const update = {
                name: req.body.name,
                nation: req.body.nation,
                price: req.body.price,
                fields: req.body.fields,
                cardsCount: req.body.cardsCount,
                readyToUse: req.body.readyToUse
            }

            try {
                await Shop_Pack.updateOne(filter, update)
            } catch (e) {
                return res.status(500).send({ status: 'MAP FIELD NOT MODIFIED', code: 500, action: 'TRY LATER POPUP' })
            }
            return res.status(200).send({ status: 'SHOP PACK MODIFIED', code: 200, token: res.locals.user.data.token })
        }
        return res.status(404).send({ status: 'MAP NOT FOUND', code: 404, action: 'GO TO MAPS' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

/**
 * Validates data sent by user to modify shop pack
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        nation: Joi.string().required(),
        price: Joi.number().required(),
        cardsCount: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router