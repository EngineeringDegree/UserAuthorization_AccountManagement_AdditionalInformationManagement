const express = require('express')
const router = express.Router()
const { Card_Type } = require('../../../models/card_type')
const { Card_Nation } = require('../../../models/card_nation')
const { Card_Effect } = require('../../../models/card_effect')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        var types = await Card_Type.find({ readyToUse: true })
        var effects = await Card_Nation.find({ readyToUse: true })
        var nations = await Card_Effect.find({ readyToUse: true })
        return res.status(200).send({ status: 'ALL RETURNED', code: 200, action: 'LOGIN', token: res.locals.user.data.token, types: types, effects: effects, nations: nations })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router