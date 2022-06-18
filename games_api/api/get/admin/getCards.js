const express = require('express')
const router = express.Router()
const { Card } = require('../../../models/card')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    // let user = await User.findOne({ email: req.query.email })
    // if(user){
    //     if(user.admin){
    //         if(checkIfBanned(user)){
    //             return res.status(401).send({status: 'USER IS BANNED', code: 401, action: 'LOGOUT'})
    //         }
    //         var check = checkToken(user.token, req.query.token)
    //         if(!check){
    //             check = await askNewToken(user.refreshToken, req.query.refreshToken, user)
    //             if(check){
    //                 var cards = await getCards(req.query.records, req.query.cardName, req.query.page)
    //                 return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN', token: check, cards: cards.cards, pages: cards.pages, page: cards.page})
    //             }
    //             return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    //         }
    //         var cards = await getCards(req.query.records, req.query.cardName, req.query.page)
    //         return res.status(200).send({status: 'USER LOGGED IN', code: 200, action: 'LOGIN', cards: cards.cards, pages: cards.pages, page: cards.page})
    //     }
    //     return res.status(401).send({status: 'USER NOT AUTHORIZED', code: 401, action: 'LOGOUT'})
    // }

    return res.status(404).send({status: 'USER NOT FOUND', code: 404, action: 'LOGOUT'})
})

/**
 * Gets cards using parameters. Default sorted by name descending. To ascend use -1.
 * @param {integer} records how much cards should be displayed at once
 * @param {string} cardName card string to search for in name
 * @param {integer} page page from which records should be displayed
 * @returns {object} with returned cards, count of pages and current page
 */
var getCards = async (records, cardName, page) => {
    var cards = [], returnedCards = []
    var pages = 1
    cards = await Card.find({ "name": { "$regex": cardName, "$options": "i"}}).sort({"name": 1})
    if(cards.length > records){
        pages = Math.ceil(cards.length/records)
        if(page > pages){
            cards.length = records
            returnedCards = cards
            page = 1
        }else{
            if(page == 1){
                cards.length = records
                returnedCards = cards
            }else{
                if(page < pages){
                    for(let i = 0; i < records; i++){
                        returnedCards.push(cards[i + (records * (page - 1))])
                    }
                }else{
                    for(let i = (page - 1) * records; i < cards.length; i++){
                        returnedCards.push(cards[i])
                    }
                }
            }
        }
    }else{
        returnedCards = cards
        page = 1
    }
    return { cards: returnedCards, pages: pages, page: page }
}

module.exports = router