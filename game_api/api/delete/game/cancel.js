const express = require('express')
const router = express.Router()
const { removePlayer } = require('../../../utils/matchmaking/matchmaking')

/*
This middleware sends cards according to parameters if user is admin
*/
router.delete('/', async (req, res) => {
    if (res.locals.user.data) {
        const success = removePlayer(req.body.email)
        if (success) {
            return res.status(200).send({ status: 'OK', code: 200, action: 'LEAVE QUEUE', token: res.locals.user.data.token })
        }

        return res.status(500).send({ status: 'SOMETHING WENT WRONG', code: 500, action: 'SOMETHING WENT WRONG POPUP', token: res.locals.user.data.token })
    }
    return res.status(404).send({ status: 'USER NOT FOUND', code: 400, action: 'LOGOUT' })
})

module.exports = router