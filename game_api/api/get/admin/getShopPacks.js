const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Shop_Pack } = require('../../../models/shop_pack')
const { filterAsset } = require('../../../utils/filter/filter')

/*
This middleware sends Shop Packs according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.query.email}&token=${req.query.token}&refreshToken=${req.query.refreshToken}`)
    } catch (e) {
        return res.status(e.response.data.code).send({ status: e.response.data.status, code: e.response.data.code, action: e.response.data.action })
    }

    if (user.data) {
        var packs = await filterAsset(req.query.records, req.query.packName, req.query.page, Shop_Pack)
        return res.status(200).send({ status: 'SHOP PACKS LISTED', code: 200, action: 'LOGIN', token: user.data.token, packs: packs.assets, pages: packs.pages, page: packs.page })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
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
        records: Joi.number().required(),
        packName: Joi.string().allow(null, ''),
        page: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router