const express = require('express')
const router = express.Router()

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
            text: 'Shop Packs',
            link: '/manage/shopPacks'
        },
        {
            currentPage: true,
            text: 'Add Shop Pack'
        }
    ]
    return res.status(200).render('admin/addShopPack', { breadcrumb: breadcrumb })
})

module.exports = router