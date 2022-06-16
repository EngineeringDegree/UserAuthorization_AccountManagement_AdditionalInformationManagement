const express = require('express')
const router = express.Router()
const { Card } = require('../../../models/card')

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
            text: 'Cards',
            link: '/manage/card'
        }
    ]

    if(!req.query.cardId){
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }
    
    try {
        var card = await Card.findOne({ _id: req.query.cardId })
    } catch(e){
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }

    if(!card){
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('admin/cardNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Modify ${card.name} Card`
    })
    
    return res.status(200).render('admin/modifyCard', { breadcrumb: breadcrumb, card: card })
})

module.exports = router