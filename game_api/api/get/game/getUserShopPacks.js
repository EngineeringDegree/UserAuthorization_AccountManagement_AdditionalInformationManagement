const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Pack } = require('../../../models/packs')
const { statuses } = require('../../../utils/enums/status')

router.get('/', async (req, res) => {
    let data = undefined
    try {
        data = await Pack.find({ owner: res.locals.user.data.id, used: false })
    } catch (e) { }
    if (data) {
        return res.status(200).send({ status: statuses.OK, code: 200, data: data })
    }

    return res.status(404).send({ status: statuses.BAD_DATA, code: 404 })
})

module.exports = router