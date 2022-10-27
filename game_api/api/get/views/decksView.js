const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Deck } = require('../../../models/deck')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware which sends decks page with breadcrumbs and decks listed
router.get('/', async (req, res) => {
    let breadcrumb = [
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
            return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
        }
    }

    if (!req.query.userId) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    let user = undefined
    try {
        user = await axios.get(`${process.env.AUTH_SERVER}/get/user/exist?id=${req.query.userId}`)
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    if (!user) {
        breadcrumb.push({
            currentPage: true,
            text: 'User not found'
        })
        return res.status(404).render('pages/userNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: false,
        text: `${user.data.username}`,
        link: `/users/user?userId=${req.query.userId}`
    })

    breadcrumb.push({
        currentPage: true,
        text: `My Decks`
    })

    let decksToReturn = []
    const decks = await Deck.find({ owner: user.data.email, deleted: false }).select('_id name nation')
    for (let i = 0; i < decks.length; i++) {
        try {
            const nation = await Card_Nation.findOne({ _id: decks[i].nation })
            if (nation) {
                decksToReturn.push({
                    _id: decks[i]._id,
                    nation: nation.name,
                    name: decks[i].name
                })
            }
        } catch (e) { }
    }
    return res.status(200).render('pages/decks', { breadcrumb: breadcrumb, decks: decksToReturn })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        userId: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router