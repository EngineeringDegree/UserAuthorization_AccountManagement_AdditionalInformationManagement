const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { Game } = require('../../../models/game')

// Middleware which sends signin page with breadcrumbs
router.get('/', async (req, res) => {
    let id = req.originalUrl.split('/')
    id = { id: id[id.length - 1] }
    let breadcrumb = [
        {
            currentPage: false,
            text: 'Home',
            link: '/'
        },
    ]
    const { error } = validate(id)
    if (error) {
        breadcrumb.push({
            currentPage: true,
            text: 'Game not found!'
        })
        return res.status(404).render('pages/gameNotFound', { breadcrumb: breadcrumb })
    }

    let game = undefined
    try {
        game = await Game.findOne({ _id: id.id })
    } catch (e) {
        breadcrumb.push({
            currentPage: true,
            text: 'Game not found!'
        })
        return res.status(404).render('pages/gameNotFound', { breadcrumb: breadcrumb })
    }
    if (!game) {
        breadcrumb.push({
            currentPage: true,
            text: 'Game not found!'
        })
        return res.status(404).render('pages/gameNotFound', { breadcrumb: breadcrumb })
    }

    breadcrumb.push({
        currentPage: true,
        text: `Game number ${game._id}`
    })
    return res.status(200).render('pages/game', { breadcrumb: breadcrumb })
})

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        id: Joi.string().required(),
    })
    const validation = schema.validate(req)
    return validation
}


module.exports = router