const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Nation } = require('../../../models/card_nation')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for puting nations
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    if (res.locals.user.data) {
        let nation = undefined
        try {
            nation = await Card_Nation.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
        }
        if (nation) {
            const filter = {
                _id: nation._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                mobility: req.body.mobility,
                defence: req.body.defence,
                attack: req.body.attack,
                vision: req.body.vision,
                readyToUse: req.body.readyToUse
            }

            try {
                await Card_Nation.updateOne(filter, update)
            } catch (e) {
                return res.status(500).send({ status: statuses.NOT_MODIFIED, code: 500, action: actions.TRY_LATER_POPUP })
            }
            return res.status(200).send({ status: statuses.MODIFIED, code: 200, token: res.locals.user.data.token })
        }

        return res.status(404).send({ status: statuses.NOT_FOUND, code: 404 })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Validates data sent by user to modify shop pack
 * @param {object} req
 * @returns nothing if there is no error, error if there is something wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        id: Joi.string().min(1).required(),
        name: Joi.string().min(1).required(),
        description: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        vision: Joi.number().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router