const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Card_Type } = require('../../../models/card_type')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: 'BAD DATA', code: 400, action: 'LOGOUT' })
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
            text: 'Types',
            link: '/manage/types'
        }
    ]

    if (!req.query.typeId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Type not found'
        })
        return res.status(404).render('admin/typeNotFound', { breadcrumb: breadcrumb })
    }

    let type = undefined
    try {
        type = await Card_Type.findOne({ _id: req.query.typeId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Type not found'
        })
        return res.status(404).render('admin/typeNotFound', { breadcrumb: breadcrumb })
    }

    if (!type) {
        breadcrumb.push({
            currentPage: true,
            text: 'Type not found'
        })
        return res.status(404).render('admin/typeNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${type._id} Type`
    })
    return res.status(200).render('admin/modifyType', { breadcrumb: breadcrumb, type: type })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        typeId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router