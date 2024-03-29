const jwt = require('jsonwebtoken')
const config = require('config')
const _ = require('lodash')
const { Token } = require('../../models/token')

/**
 * Check if tokens are valid
 * @param {string} id of owner
 * @param {string} token token sent from user to server
 * @param {string} type of token
 * @returns true if good, false if bad
 */
const checkToken = async (id, token, type) => {
    const dbToken = await Token.findOne({ owner: id, token: token, type: type })
    if (!dbToken) {
        return false
    }

    const check = jwt.verify(dbToken.token, config.get('PrivateKey'), (e) => {
        return e
    })

    if (check != null) {
        return false
    }

    return true
}

/**
 * Asks for new token based on refresh token
 * @param {string} id of owner
 * @param {string} token token sent from user to server
 * @param {string} userId of owner
 * @returns token or false
 */
const askNewToken = async (id, token, userId) => {
    if (await checkToken(id, token, process.env.REFRESH)) {
        const token = jwt.sign({ _id: userId }, config.get('PrivateKey'), { expiresIn: '1h' })
        let newToken = new Token(_.pick({
            owner: id,
            type: process.env.AUTHORIZATION,
            token: token,
            issuedAt: new Date()
        }, ['owner', 'type', 'token', 'issuedAt']))
        try {
            await newToken.save()
        } catch (e) {
            return false
        }
        return token
    }

    return false

}

module.exports = { checkToken, askNewToken }
