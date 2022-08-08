const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../../models/user')

/**
 * Check if tokens are valid and match each other
 * @param {array} userToken array of user tokens
 * @param {string} token token sent from user to server
 * @returns 
 */
var checkToken = (userToken, token) => {
    var check = jwt.verify(token, config.get('PrivateKey'), (e) => {
        return e
    })
    if (check == null) {
        for (var i = userToken.length - 1; i >= 0; i--) {
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
var askNewToken = async (userRefreshToken, refreshToken, user) => {
    if (checkToken(userRefreshToken, refreshToken)) {
        if (user) {
            var tokens = user.token
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), { expiresIn: '1h' })
            tokens.push(token)
            const filter = {
                _id: user._id
            }
            const update = {
                token: tokens
            }
            const result = await User.updateOne(filter, update)
            return token
        }
    } else {
        return false
    }
}

module.exports = { checkToken, askNewToken }
