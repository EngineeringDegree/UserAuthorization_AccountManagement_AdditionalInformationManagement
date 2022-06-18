const express = require('express')
const router = express.Router()
const { Map } = require('../../../models/map')

// Middleware which sends add card page with breadcrumbs
router.get('/', async (req, res) => {
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

module.exports = router