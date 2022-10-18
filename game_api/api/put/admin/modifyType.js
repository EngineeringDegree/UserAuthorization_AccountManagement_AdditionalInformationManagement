const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Type } = require('../../../models/card_type')

// Middleware for puting types
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        try {
            var type = await Card_Type.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
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
                stunImmunity: req.body.stunImmunity,
                scareImmunity: req.body.scareImmunity,
                silenceImmunity: req.body.silenceImmunity,
                charge: req.body.charge,
                readyToUse: req.body.readyToUse
            }

            await Card_Type.updateOne(filter, update)
            return res.status(200).send({ status: 'TYPE MODIFIED', code: 200, token: res.locals.user.data.token })
        }
        return res.status(404).send({ status: 'MAP NOT FOUND', code: 404, action: '' })
    }

    return res.status(404).send({ status: 'USER NOT FOUND', code: 404, action: 'LOGOUT' })
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