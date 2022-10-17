const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map_Field } = require('../../../models/map_field')

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
            text: 'Fields',
            link: '/manage/fields'
        }
    ]

    if (!req.query.fieldId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Field not found'
        })
        return res.status(404).render('admin/fieldNotFound', { breadcrumb: breadcrumb })
    }

    try {
        var field = await Map_Field.findOne({ _id: req.query.fieldId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Field not found'
        })
        return res.status(404).render('admin/fieldNotFound', { breadcrumb: breadcrumb })
    }


    if (!field) {
        breadcrumb.push({
            currentPage: true,
            text: 'Field not found'
        })
        return res.status(404).render('admin/fieldNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${field._id} Effect`
    })
    return res.status(200).render('admin/modifyField', { breadcrumb: breadcrumb, field: field })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        fieldId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router