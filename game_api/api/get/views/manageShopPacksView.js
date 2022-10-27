const express = require('express')
const router = express.Router()

// Middleware which sends shop packs page with breadcrumbs
router.get('/', async (req, res) => {
    const breadcrumb = [
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
            currentPage: true,
            text: 'Shop Packs'
        }
    ]


    return res.status(200).render('admin/manageShopPacks', { breadcrumb: breadcrumb })
})

module.exports = router