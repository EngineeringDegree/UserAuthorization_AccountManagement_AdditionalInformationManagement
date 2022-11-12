const express = require('express')
const router = express.Router()
const { Card_Type } = require('../../../models/card_type')
const { Card_Nation } = require('../../../models/card_nation')
const { Card_Effect } = require('../../../models/card_effect')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const types = await Card_Type.find({})
        const nations = await Card_Nation.find({})
        const effects = await Card_Effect.find({})
        return res.status(200).send({ status: 'ALL RETURNED', code: 200, action: 'LOGIN', token: res.locals.user.data.token, types: types, effects: effects, nations: nations })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

module.exports = router