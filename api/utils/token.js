const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../models/user')

var checkToken = (userToken, token) => {
    var check = jwt.verify(token, config.get('PrivateKey'), (e)=>{
        return e
    })
    if(check == null){
        for(var i = userToken.length - 1; i >= 0; i--){
            if(userToken[i] == token){
                return true
            }
        }
        return false
    }else{
        return false
    }
}

var askNewToken = async (userRefreshToken, refreshToken, user) => {
    if(checkToken(userRefreshToken, refreshToken)){
        if(user){
            var tokens = user.token
            const token = jwt.sign({ _id: user._id }, config.get('PrivateKey'), {expiresIn: '1h' })
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
    }else{
        return false
    }
}

module.exports = { checkToken, askNewToken }
