const express = require('express')
const router = express.Router()
const { Map_Field } = require('../../../models/map_field')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const fields = await Map_Field.find({})
        return res.status(200).send({ status: 'MAP FIELDS LISTED', code: 200, action: 'LOGIN', token: res.locals.user.data.token, fields: fields })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

module.exports = router