const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')

// Middleware which sends deck add page with breadcrumbs
router.get('/', async (req, res) => {
    var breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        }
    ]

    const { error } = validate(req.query)
    if (error) {
        if (!req.query.userId) {
            breadcrumb.push({
                currentPage: true,
                text: 'User not found'
            })
            return res.status(500).render('pages/userNotFound', { breadcrumb: breadcrumb })
        }
    }

    if (!req.query.userId) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    try {
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/user/exist?id=${req.query.userId}`)
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    if (!user.data.userReturned) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    if (user.data.email == req.query.email) {
        try {
            user = await axios.get(`${process.env.AUTH_SERVER}/get/checkIfLoggedIn?email=${req.query.email}&token=${req.query.token}&refreshToken=${req.query.refreshToken}`)
        } catch (e) {
            return res.status(401).render('pages/logout', { breadcrumb: breadcrumb })
        }

        if (user.data) {
            breadcrumb.push({
                currentPage: false,
                text: 'My Decks',
                link: `/decks?userId=${req.query.userId}`
            })
            breadcrumb.push({
                currentPage: true,
                text: 'Edit Deck'
            })

            return res.status(200).render('pages/editDeck', { breadcrumb: breadcrumb })
        }
        return res.status(401).render('pages/logout', { breadcrumb: breadcrumb })
    }
    breadcrumb.push({
        currentPage: true,
        text: 'Not owner'
    })
    return res.status(401).render('pages/notOwner', { breadcrumb: breadcrumb })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        deckId: Joi.string().required(),
        userId: Joi.string().required(),
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router