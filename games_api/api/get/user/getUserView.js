const express = require('express')
const router = express.Router()

/*
Middleware which sends user specified in parameter. 
*/
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
        {
            currentPage: false,
            text: 'Users',
            link: '/users'
        }
    ]

    if(!req.query.userId){
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    try {
        // ask for user._id authorization server
        var user = await User.findOne({ _id: req.query.userId })
    } catch(e){
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    if(!user){
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `${user.username}`
    })

    return res.status(200).render('pages/user', { breadcrumb: breadcrumb, id: req.query.userId })
})

module.exports = router