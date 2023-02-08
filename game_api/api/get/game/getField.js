const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map_Field } = require('../../../models/map_field')
const { statuses } = require('../../../utils/enums/status')

router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    let data = undefined
    try {
        data = await Map_Field.findOne({ _id: req.query.id })
    } catch (e) { }
    if (data) {
        return res.status(200).send({ status: statuses.OK, code: 200, data: data })
    }

    return res.status(404).send({ status: statuses.BAD_DATA, code: 404 })
})

function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router