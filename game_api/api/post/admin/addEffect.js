const express = require('express')
const router = express.Router()
const _ = require('lodash')
const Joi = require('joi')
const { Card_Effect } = require('../../../models/card_effect')
const { statuses } = require('../../../utils/enums/status')
const { actions } = require('../../../utils/enums/action')

// Middleware for creating a card
router.post('/', async (req, res) => {
    const { error } = validate(req.body)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.BAD_DATA_POPUP })
    }

    if (res.locals.user.data) {
        await createEffect(req.body)
        return res.status(200).send({ status: 'EFFECT CREATED', code: 200, token: res.locals.user.data.token })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404, action: actions.LOGOUT })
})

/**
 * Save map with following arguments
 * @param {object} effect to save 
 */
async function createEffect(effect) {
    let newEffect = new Card_Effect(_.pick({
        name: effect.name,
        description: effect.description,
        mobility: effect.mobility,
        defence: effect.defence,
        attack: effect.attack,
        vision: effect.vision,
        canUseOn: effect.canUseOn,
        cooldown: effect.cooldown,
        duration: effect.duration,
        cost: effect.cost,
        stunImmunity: effect.stunImmunity,
        scareImmunity: effect.scareImmunity,
        silenceImmunity: effect.silenceImmunity,
        stun: effect.stun,
        scare: effect.scare,
        silence: effect.silence,
        readyToUse: false
    }, ['name', 'description', 'mobility', 'defence', 'attack', 'vision', 'canUseOn', 'cooldown', 'duration', 'cost', 'stunImmunity', 'scareImmunity', 'silenceImmunity', 'stun', 'scare', 'silence', 'readyToUse']))
    try {
        await newEffect.save()
    } catch (e) { }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothing if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        name: Joi.string().min(1).required(),
        description: Joi.string().required(),
        mobility: Joi.number().required(),
        defence: Joi.number().required(),
        attack: Joi.number().required(),
        vision: Joi.number().required(),
        canUseOn: Joi.number().required(),
        cooldown: Joi.number().required(),
        duration: Joi.number().required(),
        cost: Joi.string().required(),
        stunImmunity: Joi.boolean().required(),
        scareImmunity: Joi.boolean().required(),
        silenceImmunity: Joi.boolean().required(),
        stun: Joi.boolean().required(),
        scare: Joi.boolean().required(),
        silence: Joi.boolean().required()
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router