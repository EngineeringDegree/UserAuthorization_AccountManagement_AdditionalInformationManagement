const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../../models/user')

/**
 * Check if tokens are valid and match each other
 * @param {array} userToken array of user tokens
 * @param {string} token token sent from user to server
 * @returns 
 */
const checkToken = (userToken, token) => {
    const check = jwt.verify(token, config.get('PrivateKey'), (e) => {
        return e
    })
    if (check == null) {
        for (let i = userToken.length - 1; i >= 0; i--) {
            if (userToken[i] == token) {
                return true
            }
        }
        return false
    } else {
        return false
    }
}

/**
 * 
 * @param {Array} userRefreshToken array of refreshToken taken from database. 
 * @param {String} refreshToken refreshToken sent from user
 * @param {Object} user user model from database 
 * @returns 
 */
const askNewToken = async (userRefreshToken, refreshToken, user) => {
    if (checkToken(userRefreshToken, refreshToken)) {
        if (user) {
            let tokens = user.token
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), { expiresIn: '1h' })
            tokens.push(token)
            const filter = {
                _id: user._id
            }
            const update = {
                token: tokens
            }
            try {
                const result = await User.updateOne(filter, update)
            } catch (e) { }
            return token
        }
    } else {
        return false
    }
}

module.exports = { checkToken, askNewToken }
