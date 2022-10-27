const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')

/*
Middleware which sends user specified in parameter. 
*/
router.get('/', async (req, res) => {
    let breadcrumb = [
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
        currentPage: true,
        text: `${user.data.username}`
    })

    return res.status(200).render('pages/user', { breadcrumb: breadcrumb, id: req.query.userId })
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