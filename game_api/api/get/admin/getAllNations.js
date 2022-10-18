const express = require('express')
const router = express.Router()
const { Card_Nation } = require('../../../models/card_nation')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        var nations = await Card_Nation.find({ readyToUse: true })
        return res.status(200).send({ status: 'CARDS LISTED', code: 200, action: 'LOGIN', token: res.locals.user.data.token, nations: nations })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router