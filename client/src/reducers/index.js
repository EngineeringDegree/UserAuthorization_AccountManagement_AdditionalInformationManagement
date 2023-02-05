import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'
import loginReducer from './user/userLogin-reducer'
import usernameReducer from './user/userUsername-reducer'
import passwordReducer from './user/userPassword-reducer'
import setPasswordReducer from './user/setUserPassword-reducer'
import emailReducer from './user/userEmail-reducer'
import confirmedReducer from './user/userConfirmed-reducer'
import adminReducer from './user/userAdmin-reducer'
import registerReducer from './user/userRegister-reducer'
import authReducer from './user/userAuthorize-reducer'
import getUserReducer from './user/getUser-reducer'
import getCardsReducer from './cards/getCards-reducer'
import getUsersReducer from './users/getUsers-reducer'
import banUserReducer from './user/userBan-reducer'

/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer,
    userLogin: loginReducer,
    userRegister: registerReducer,
    authReducer: authReducer,
    getUserReducer: getUserReducer,
    getCardsReducer: getCardsReducer,
    username: usernameReducer,
    password: passwordReducer,
    email: emailReducer,
    confirmed: confirmedReducer,
    admin: adminReducer,
    setPassword: setPasswordReducer,
    users: getUsersReducer,
    userBanned: banUserReducer
})

export default rootReducer