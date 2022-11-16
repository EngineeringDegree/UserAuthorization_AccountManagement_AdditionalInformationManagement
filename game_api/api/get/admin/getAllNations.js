const express = require('express')
const router = express.Router()
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        const nations = await Card_Nation.find({})
        return res.status(200).send({ status: statuses.NATIONS_LISTED, code: 200, token: res.locals.user.data.token, nations: nations })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

module.exports = router