const express = require('express')
const router = express.Router()
var { Card_Nation } = require('../../../models/card_nation')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        var nationsToReturn = []
        var nations = await Card_Nation.find({ readyToUse: false })
        if (nations) {
            for (let i = 0; i < nations.length; i++) {
                nationsToReturn.push(nations[i].name)
            }
            return res.status(200).send({ status: 'OK', code: 200, nations: nationsToReturn, token: res.locals.user.data.token })
        }

        return res.status(404).send({ status: 'NATIONS NOT FOUND', code: 404, action: 'NATIONS NOT FOUND POPUP' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
})

module.exports = router