import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'
import loginReducer from './user/userLogin-reducer'
import registerReducer from './user/userRegister-reducer'
import authReducer from './user/userAuthorize-reducer'
import getUserReducer from './user/getUser-reducer'

/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer,
    userLogin: loginReducer,
    userRegister: registerReducer,
    authReducer: authReducer,
    getUserReducer: getUserReducer
})

export default rootReducer