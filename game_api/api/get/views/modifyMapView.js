const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Map } = require('../../../models/map')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400, action: 'LOGOUT'})
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
            text: 'Maps',
            link: '/manage/map'
        }
    ]

    if(!req.query.mapId){
        breadcrumb.push({
            currentPage: true,
            text: 'Map not found'
        })
        return res.status(404).render('admin/mapNotFound', { breadcrumb: breadcrumb })
    }

    try {
        var map = await Map.findOne({ _id: req.query.mapId })
    } catch(e){
        breadcrumb.push({
            currentPage: true,
            text: 'Map not found'
        })
        return res.status(404).render('admin/mapNotFound', { breadcrumb: breadcrumb })
    }

    if(!map){
        breadcrumb.push({
            currentPage: true,
            text: 'Map not found'
        })
        return res.status(404).render('admin/mapNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${map._id} Map`
    })
    return res.status(200).render('admin/modifyMap', { breadcrumb: breadcrumb, map: map })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
 function validate(req) {
    const schema = Joi.object({
        mapId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router