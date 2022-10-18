const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Card_Effect } = require('../../../models/card_effect')

// Middleware for putting effects
router.put('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
    }

    if (res.locals.user.data) {
        try {
            var effect = await Card_Effect.findOne({ _id: req.body.id })
        } catch (e) {
            return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'BAD DATA POPUP' })
        }
        if (effect) {
            const filter = {
                _id: effect._id
            }
            const update = {
                name: req.body.name,
                description: req.body.description,
                mobility: req.body.mobility,
                defence: req.body.defence,
                attack: req.body.attack,
                canUseOn: req.body.canUseOn,
                cooldown: req.body.cooldown,
                duration: req.body.duration,
                cost: req.body.cost,
                stunImmunity: req.body.stunImmunity,
                scareImmunity: req.body.scareImmunity,
                silenceImmunity: req.body.silenceImmunity,
                stun: req.body.stun,
                scare: req.body.scare,
                silence: req.body.silence,
                readyToUse: req.body.readyToUse
            }

            await Card_Effect.updateOne(filter, update)
            return res.status(200).send({ status: 'EFFECT MODIFIED', code: 200, token: res.locals.user.data.token })
        }
        return res.status(404).send({ status: 'EFFECT NOT FOUND', code: 404, action: '' })
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
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        canUseOn: Joi.number().required(),
        cooldown: Joi.number().required(),
        duration: Joi.number().required(),
        cost: Joi.string().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        stun: Joi.boolean().required(),
        scare: Joi.boolean().required(),
        silence: Joi.boolean().required(),
        readyToUse: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router