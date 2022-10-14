const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
    }

    var breadcrumb = [
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
            text: 'Nations',
            link: '/manage/nations'
        }
    ]

    if (!req.query.nationId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Nation not found'
        })
        return res.status(404).render('admin/nationNotFound', { breadcrumb: breadcrumb })
    }

    try {
        var nation = await Card_Nation.findOne({ _id: req.query.nationId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Nation not found'
        })
        return res.status(404).render('admin/nationNotFound', { breadcrumb: breadcrumb })
    }

    if (!nation) {
        breadcrumb.push({
            currentPage: true,
            text: 'Nation not found'
        })
        return res.status(404).render('admin/nationNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${nation._id} Nation`
    })
    return res.status(200).render('admin/modifyNation', { breadcrumb: breadcrumb, nation: nation })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        nationId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router