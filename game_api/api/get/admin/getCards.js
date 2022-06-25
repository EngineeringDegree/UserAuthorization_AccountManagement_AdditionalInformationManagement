const express = require('express')
const router = express.Router()
const Joi = require('joi')
const axios = require('axios')
const { Card } = require('../../../models/card')

/*
This middleware sends cards according to parameters if user is admin
*/
router.get('/', async (req, res) => {
    const { error } = validate(req.query)
    if (error) {
        return res.status(400).send({status: 'BAD DATA', code: 400, action: 'LOGOUT'})
    }

    try{
        var user = await axios.get(`${process.env.AUTH_SERVER}/get/admin/premisions?email=${req.query.email}&token=${req.query.token}&refreshToken=${req.query.refreshToken}`)
    }catch(e){
        return res.status(e.response.data.code).send({status: e.response.data.status, code: e.response.data.code, action: e.response.data.action})
    }

    if(user.data){
        var cards = await getCards(req.query.records, req.query.cardName, req.query.page)
        return res.status(200).send({status: 'CARDS LISTED', code: 200, action: 'LOGIN', token: user.data.token, cards: cards.cards, pages: cards.pages, page: cards.page})
    }

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
        cardName: Joi.string().allow(null, ''),
        page: Joi.number().required()
    })
    const validation = schema.validate(req)
    return validation
}

module.exports = router