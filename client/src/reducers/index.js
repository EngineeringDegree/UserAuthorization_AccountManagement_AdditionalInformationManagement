import { combineReducers } from 'redux'
import checkIfLoggedInReducer from './user/checkIfLoggedIn-reducer'

window.localStorage.setItem('email', 'madeja1@onet.eu')
window.localStorage.setItem('token', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzVhN2VjOGZlMzU2M2FjOTI1MTk5OTUiLCJpYXQiOjE2Njc3MzgwMzAsImV4cCI6MTY2Nzc0MTYzMH0.UYVvU1atjzCY-TCVDkJ0KGd-X_OmLVzuwESmSRCXFw')
window.localStorage.setItem('refreshToken', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MzVhN2VjOGZlMzU2M2FjOTI1MTk5OTUiLCJpYXQiOjE2NjgyNTY4MzAsImV4cCI6MTY3MzQ0MDgzMH0.uaGC6rzdwC8PX0eiO9XwL0RdTxpR0g8b7zNI4u-fxx')
/**
 * Combines all reducers.
 */
const rootReducer = combineReducers({
    userLoggedIn: checkIfLoggedInReducer
})

export default rootReducer