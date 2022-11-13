const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { removePlayer } = require('../../../utils/matchmaking/matchmaking')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

/*
This middleware sends cards according to parameters if user is admin
*/
router.delete('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    if (res.locals.user.data) {
        const success = removePlayer(req.body.id)
        if (success) {
            return res.status(200).send({ status: statuses.OK, code: 200, action: actions.LEAVE_QUEUE, token: res.locals.user.data.token })
        }

        return res.status(500).send({ status: statuses.SOMETHING_WENT_WRONG, code: 500, action: actions.SOMETHING_WENT_WRONG_POPUP, token: res.locals.user.data.token })
    }
    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 400, action: actions.LOGOUT })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router