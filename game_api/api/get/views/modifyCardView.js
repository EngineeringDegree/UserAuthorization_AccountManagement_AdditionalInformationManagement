const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card } = require('../../../models/card')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400, action: 'LOGOUT' })
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
            text: 'Cards',
            link: '/manage/card'
        }
    ]

    if (!req.query.cardId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }

    let card = undefined
    try {
        card = await Card.findOne({ _id: req.query.cardId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }

    if (!card) {
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${card._id} Card`
    })

    return res.status(200).render('admin/modifyCard', { breadcrumb: breadcrumb, card: card })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        cardId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router