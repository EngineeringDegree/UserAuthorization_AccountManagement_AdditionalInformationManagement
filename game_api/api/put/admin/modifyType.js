const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Type } = require('../../../models/card_type')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for puting types
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
    }

    if (res.locals.user.data) {
        let type = undefined
        try {
            type = await Card_Type.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: statuses.BAD_DATA, code: 400_POPUP })
        }
        if (type) {
            const filter = {
                _id: type._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                buffNearbyAllies: req.body.buffNearbyAllies,
                debuffNearbyEnemies: req.body.debuffNearbyEnemies,
                mobility: req.body.mobility,
                defence: req.body.defence,
                attack: req.body.attack,
                vision: req.body.vision,
                stunImmunity: req.body.stunImmunity,
                scareImmunity: req.body.scareImmunity,
                silenceImmunity: req.body.silenceImmunity,
                charge: req.body.charge,
                readyToUse: req.body.readyToUse
            }

            try {
                await Card_Type.updateOne(filter, update)
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
        buffNearbyAllies: Joi.string().required(),
        debuffNearbyEnemies: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        vision: Joi.number().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        charge: Joi.boolean().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router