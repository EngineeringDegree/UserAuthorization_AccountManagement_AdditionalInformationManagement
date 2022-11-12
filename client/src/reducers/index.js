import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'
import loginReducer from './user/userLogin-reducer'

/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer,
    userLogin: loginReducer
})

export default rootReducer