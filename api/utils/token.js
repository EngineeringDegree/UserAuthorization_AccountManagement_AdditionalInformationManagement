const jwt = require('jsonwebtoken')
const config = require('config')
const { User } = require('../models/user')

var checkToken = (userToken, token) => {
    var check = jwt.verify(userToken, config.get('PrivateKey'), (e)=>{
        return e
    })
    if(check == null){
        if(userToken == token){
            return true
        }
        return false
    }else{
        return false
    }
}

var askNewToken = async (refreshToken, userRefreshToken, user) => {
    if(checkToken(refreshToken, userRefreshToken)){
        if(user){
            const token = jwt.sign({ _id: user }, config.get('PrivateKey'), {expiresIn: '1h' })
            const filter = {
                _id: user
            }
            const update = {
                token: token
            }
            const result = await User.updateOne(filter, update)
            return token
        }
    }else{
        return false
    }
}

module.exports = { checkToken, askNewToken }
