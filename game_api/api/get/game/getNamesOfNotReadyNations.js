const express = require('express')
const router = express.Router()
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')

router.get('/', async (req, res) => {
    if (res.locals.user.data) {
        let nationsToReturn = []
        const nations = await Card_Nation.find({ readyToUse: false })
        if (nations) {
            for (let i = 0; i < nations.length; i++) {
                nationsToReturn.push(nations[i].name)
            }
            return res.status(200).send({ status: statuses.OK, code: 200, nations: nationsToReturn, token: res.locals.user.data.token })
        }

        return res.status(404).send({ status: statuses.NATIONS_NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

module.exports = router