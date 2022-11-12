const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Effect } = require('../../../models/card_effect')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: actions.LOGOUT })
    }

    let breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: false,
            text: 'Manage',
            link: '/manage'
        },
        {
            currentPage: false,
            text: 'Effects',
            link: '/manage/effects'
        }
    ]

    if (!req.query.effectId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Effect not found'
        })
        return res.status(404).render('admin/effectNotFound', { breadcrumb: breadcrumb })
    }

    let effect = undefined
    try {
        effect = await Card_Effect.findOne({ _id: req.query.effectId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Effect not found'
        })
        return res.status(404).render('admin/effectNotFound', { breadcrumb: breadcrumb })
    }

    if (!effect) {
        breadcrumb.push({
            currentPage: true,
            text: 'Effect not found'
        })
        return res.status(404).render('admin/effectNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${effect._id} Effect`
    })
    return res.status(200).render('admin/modifyEffect', { breadcrumb: breadcrumb, effect: effect })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        effectId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router