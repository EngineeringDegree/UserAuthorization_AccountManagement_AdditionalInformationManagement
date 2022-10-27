const express = require('express')
const router = express.Router()

// Middleware which sends add Field page with breadcrumbs
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
            currentPage: false,
            text: 'Fields',
            link: '/manage/fields'
        },
        {
            currentPage: true,
            text: 'Add Field'
        }
    ]
    return res.status(200).render('admin/addField', { breadcrumb: breadcrumb })
})

module.exports = router