const express = require('express')
const router = express.Router()
const { User } = require('../../../models/user')

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
        var user = await User.findOne({ _id: req.query.userId })
    } catch(e){
        breadcrumb.push({
            currentPage: true,
            text: 'Card not found'
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

    return res.status(200).render('pages/user', { breadcrumb: breadcrumb, username: user.username, id: user._id, email: user.email, confirmed: user.confirmed, admin: user.admin })
})

module.exports = router