const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map_Field } = require('../../../models/map_field')
const { filterAsset } = require('../../../utils/filter/filter')
const { statuses } = require('../../../utils/enums/status')

/*
This middleware sends fields according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    if (res.locals.user.data) {
        const fields = await filterAsset(req.query.records, req.query.fieldName, req.query.page, Map_Field)
        return res.status(200).send({ status: statuses.FIELDS_LISTED, code: 200, token: res.locals.user.data.token, fields: fields.assets, pages: fields.pages, page: fields.page })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
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
        fieldName: Joi.string().allow(null, ''),
        page: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router