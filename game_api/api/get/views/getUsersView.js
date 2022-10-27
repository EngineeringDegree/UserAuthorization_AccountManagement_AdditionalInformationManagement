const express = require('express')
const router = express.Router()

/*
Middleware which sends users specified in parameters. 
*/
router.get('/', async (req, res) => {
    const breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: true,
            text: 'Users'
        }
    ]

    return res.status(200).render('pages/users', { breadcrumb: breadcrumb })
})

module.exports = router