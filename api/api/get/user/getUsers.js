const express = require('express')
const router = express.Router()
const { User } = require('../../../models/user')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
Middleware which sends users specified in parameters. 
*/
router.get('/', async (req, res) => {
    let user = await User.findOne({ email: req.query.email })
    if(user){
        if(checkIfBanned(user)){
            return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
        }
        var check = checkToken(user.token, req.query.token)
        if(!check){
            check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
            if(check){
                var users = getUsers(req)
                if(user.admin){
                    return res.status(200).send({ status: "USERS FOUND AND SHOW BANHAMMER", token: check, users: users })
                }

                return res.status(200).send({ status: "USERS FOUND", token: check, users: users })
            }
            return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
        }
        var users = getUsers(req)
        if(user.admin){
            return res.status(200).send({ status: "USERS FOUND AND SHOW BANHAMMER", users: users })
        }

        return res.status(200).send({ status: "USERS FOUND", users: users })
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'}) 
})

/**
 * Function which filters users to return with specified parameters and returns them with page and pages info
 * @param {object} req of query parameters
 * @returns object containing user info, page and avaiable pages
 */
var getUsers = (req) => {
    var users = [], allUsers = []
    var pages = 1, page = 1, records = 50, username = ''
    if(req.query.page){
        page = req.query.page
    }

    if(req.query.records){
        records = req.query.records
    }

    if(req.query.username){
        username = req.query.username
    }

    allUsers = await User.find({ "username": { "$regex": username, "$options": "i"}}).sort({"username": 1})
    if(allUsers.length > records){
        pages = Math.ceil(allUsers.length/records)
        if(page > pages){
            for(let i = 0; i < allUsers.length; i++){
                if(i < records){
                    users.push({
                        username: allUsers[i].username, 
                        id: allUsers[i]._id
                    })
                } else {
                    break
                }
            }
            page = 1
        }else{
            if(page == 1){
                if(page < pages){
                    for(let i = 0; i < records; i++){
                        users.push({
                            username: allUsers[i].username, 
                            id: allUsers[i]._id
                        })
                    }
                }else{
                    for(let i = (page - 1) * records; i < allUsers.length; i++){
                        users.push({
                            username: allUsers[i].username, 
                            id: allUsers[i]._id
                        })
                    }
                }
            }else{
                if(page < pages){
                    for(let i = 0; i < records; i++){
                        users.push({
                            username: allUsers[i + (records * (page - 1))].username,
                            id: allUsers[i + (records * (page - 1))]._id
                        })
                    }
                }else{
                    for(let i = (page - 1) * records; i < allUsers.length; i++){
                        users.push({
                            username: allUsers[i].username, 
                            id: allUsers[i]._id
                        })
                    }
                }
            }
        }
    }else{
        for(let i = 0; i < allUsers.length; i++){
            users.push({
                username: allUsers[i].username, 
                id: allUsers[i]._id
            })
        }
        page = 1
    }

    return { users: users, pages: pages, page: page }
}

module.exports = router