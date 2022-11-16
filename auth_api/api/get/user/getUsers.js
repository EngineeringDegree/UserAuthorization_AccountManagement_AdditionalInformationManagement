const express = require('express')
const router = express.Router()
const Joi = require('joi')
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')
const { statuses } = require('../../../utils/enums/status')

/*
Middleware which sends users specified in parameters. 
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({ status: statuses.BAD_DATA, code: 400 })
    }

    const user = await User.findOne({ email: req.query.email })
    if (user) {
        if (checkIfBanned(user)) {
            return res.status(401).send({ status: statuses.USER_IS_BANNED, code: 401 })
        }
        let check = await checkToken(user._id, req.query.token, process.env.AUTHORIZATION)
        if (!check) {
            check = await askNewToken(user._id, req.query.refreshToken, user._id)
            if (check) {
                const users = await getUsers(req)
                if (user.admin) {
                    return res.status(200).send({ status: statuses.USERS_FOUND_AND_SHOW_BANHAMMER, code: 200, token: check, users: users })
                }

                return res.status(200).send({ status: statuses.USERS_FOUND, code: 200, token: check, users: users })
            }
            return res.status(401).send({ status: statuses.USER_NOT_AUTHORIZED, code: 401 })
        }
        const users = await getUsers(req)
        if (user.admin) {
            return res.status(200).send({ status: statuses.USERS_FOUND_AND_SHOW_BANHAMMER, code: 200, users: users })
        }

        return res.status(200).send({ status: statuses.USERS_FOUND, code: 200, users: users })
    }

    return res.status(404).send({ status: statuses.USER_NOT_FOUND, code: 404 })
})

/**
 * Function which filters users to return with specified parameters and returns them with page and pages info
 * @param {object} req of query parameters
 * @returns object containing user info, page and avaiable pages
 */
const getUsers = async (req) => {
    let users = [], pages = 1, page = 1, records = 50, username = ''
    if (req.query.page) {
        page = req.query.page
    }

    if (req.query.records) {
        records = req.query.records
    }

    if (req.query.username) {
        username = req.query.username
    }

    const allUsers = await User.find({ "username": { "$regex": username, "$options": "i" } }).sort({ "username": 1 })
    if (allUsers.length > records) {
        pages = Math.ceil(allUsers.length / records)
        if (page > pages) {
            for (let i = 0; i < allUsers.length; i++) {
                if (i < records) {
                    users.push({
                        username: allUsers[i].username,
                        id: allUsers[i]._id
                    })
                } else {
                    break
                }
            }
            page = 1
        } else {
            if (page == 1) {
                if (page < pages) {
                    for (let i = 0; i < records; i++) {
                        users.push({
                            username: allUsers[i].username,
                            id: allUsers[i]._id
                        })
                    }
                } else {
                    for (let i = (page - 1) * records; i < allUsers.length; i++) {
                        users.push({
                            username: allUsers[i].username,
                            id: allUsers[i]._id
                        })
                    }
                }
            } else {
                if (page < pages) {
                    for (let i = 0; i < records; i++) {
                        users.push({
                            username: allUsers[i + (records * (page - 1))].username,
                            id: allUsers[i + (records * (page - 1))]._id
                        })
                    }
                } else {
                    for (let i = (page - 1) * records; i < allUsers.length; i++) {
                        users.push({
                            username: allUsers[i].username,
                            id: allUsers[i]._id
                        })
                    }
                }
            }
        }
    } else {
        for (let i = 0; i < allUsers.length; i++) {
            users.push({
                username: allUsers[i].username,
                id: allUsers[i]._id
            })
        }
        page = 1
    }

    return { users: users, pages: pages, page: page }
}

/**
 * Validates data sent by user
 * @param {object} req object
 * @returns nothin if validation is passed and error if somethin is wrong
 */
function validate(req) {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        token: Joi.string().required(),
        refreshToken: Joi.string().required(),
        records: Joi.number().required(),
        username: Joi.string().allow(null, ''),
        page: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router