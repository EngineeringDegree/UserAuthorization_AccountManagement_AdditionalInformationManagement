const express = require('express')
const router = express.Router()
const { removePlayer } = require('../../../utils/matchmaking/matchmaking')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.delete('/', async (req, res) => {
    if (res.locals.user.data) {
        const success = removePlayer(req.body.email)
        if (success) {
            return res.status(200).send({ status: statuses.OK, code: 200, action: actions.LEAVE_QUEUE, token: res.locals.user.data.token })
        }

        return res.status(500).send({ status: statuses.SOMETHING_WENT_WRONG, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP, token: res.locals.user.data.token })
    }
    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 400, action: actions.LOGOUT })
})

module.exports = router