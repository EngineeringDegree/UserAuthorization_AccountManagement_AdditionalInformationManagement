const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Pack } = require('../../../models/packs')
const { Card_Nation } = require('../../../models/card_nation')

// Middleware which sends packs page with breadcrumbs
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

    breadcrumb.push({
        currentPage: true,
        text: `${user.data.username}`
    })

    var packsToReturn = []
    var userPacks = await Pack.find({ owner: user.data.email, used: false }).select('_id nation packName')
    for (let i = 0; i < userPacks.length; i++) {
        if (userPacks[i].nation == 'All') {
            packsToReturn.push({
                _id: userPacks[i]._id,
                nation: 'All',
                packName: userPacks[i].packName
            })
        } else {
            try {
                var nation = await Card_Nation.findOne({ _id: userPacks[i].nation })
                if (nation) {
                    packsToReturn.push({
                        _id: userPacks[i]._id,
                        nation: nation.name,
                        packName: userPacks[i].packName
                    })
                }
            } catch (e) { }
        }
    }
    return res.status(200).render('pages/packs', { breadcrumb: breadcrumb, packs: packsToReturn })
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