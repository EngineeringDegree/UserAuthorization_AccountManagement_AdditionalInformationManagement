import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'
import loginReducer from './user/userLogin-reducer'
import registerReducer from './user/userRegister-reducer'

/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer,
    userLogin: loginReducer,
    userRegister: registerReducer
})

export default rootReducer