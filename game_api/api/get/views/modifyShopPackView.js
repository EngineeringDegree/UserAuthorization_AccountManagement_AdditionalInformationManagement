const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Shop_Pack } = require('../../../models/shop_pack')

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
            text: 'Shop Packs',
            link: '/manage/shopPacks'
        }
    ]

    if (!req.query.packId) {
        breadcrumb.push({
            currentPage: true,
            text: 'Shop Pack not found'
        })
        return res.status(404).render('admin/shopPackNotFound', { breadcrumb: breadcrumb })
    }

    let pack = undefined
    try {
        pack = await Shop_Pack.findOne({ _id: req.query.packId })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Shop Pack not found'
        })
        return res.status(404).render('admin/shopPackNotFound', { breadcrumb: breadcrumb })
    }

    if (!pack) {
        breadcrumb.push({
            currentPage: true,
            text: 'Shop Pack not found'
        })
        return res.status(404).render('admin/shopPackNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${pack._id} Shop Pack`
    })

    return res.status(200).render('admin/modifyShopPack', { breadcrumb: breadcrumb, pack: pack })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        packId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router