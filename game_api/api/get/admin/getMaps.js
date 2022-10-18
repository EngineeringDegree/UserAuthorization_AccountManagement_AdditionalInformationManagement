const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map } = require('../../../models/map')
const { filterAsset } = require('../../../utils/filter/filter')

/*
This middleware sends maps according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    if (res.locals.user.data) {
        var maps = await filterAsset(req.query.records, req.query.mapName, req.query.page, Map)
        return res.status(200).send({ status: 'MAP LISTED', code: 200, action: 'LOGIN', token: res.locals.user.data.token, maps: maps.assets, pages: maps.pages, page: maps.page })
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
        mapName: Joi.string().allow(null, ''),
        page: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router