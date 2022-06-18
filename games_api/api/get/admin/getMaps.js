const express = require('express')
const router = express.Router()
const { Map } = require('../../../models/map')
const { checkToken, askNewToken } = require('../../../utils/auth/auth_token')
const { checkIfBanned } = require('../../../utils/auth/auth_bans')

/*
This middleware sends maps according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    let user = await User.findOne({ email: req.query.email })
    if(user){
        if(user.admin){
            if(checkIfBanned(user)){
                return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
            }
            var check = checkToken(user.token, req.query.token)
            if(!check){
                check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
                if(check){
                    var maps = await getMaps(req.query.records, req.query.mapName, req.query.page)
                    return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN', token: check, maps: maps.maps, pages: maps.pages, page: maps.page})
                }
                return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
            }
            var maps = await getMaps(req.query.records, req.query.mapName, req.query.page)
            return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN', maps: maps.maps, pages: maps.pages, page: maps.page})
        }
        return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Gets cards using parameters. Default sorted by name descending. To ascend use -1.
 * @param {integer} records how much maps should be displayed at once
 * @param {string} mapName map string to search for in name
 * @param {integer} page page from which records should be displayed
 * @returns {object} with returned cards, count of pages and current page
 */
var getMaps = async (records, mapName, page) => {
    var maps = [], returnedMaps = []
    var pages = 1
    maps = await Map.find({ "name": { "$regex": mapName, "$options": "i"}}).sort({"name": 1})
    if(maps.length > records){
        pages = Math.ceil(maps.length/records)
        if(page > pages){
            maps.length = records
            returnedMaps = maps
            page = 1
        }else{
            if(page == 1){
                maps.length = records
                returnedMaps = maps
            }else{
                if(page < pages){
                    for(let i = 0; i < records; i++){
                        returnedMaps.push(maps[i + (records * (page - 1))])
                    }
                }else{
                    for(let i = (page - 1) * records; i < maps.length; i++){
                        returnedMaps.push(maps[i])
                    }
                }
            }
        }
    }else{
        returnedMaps = maps
        page = 1
    }
    return { maps: returnedMaps, pages: pages, page: page }
}

module.exports = router