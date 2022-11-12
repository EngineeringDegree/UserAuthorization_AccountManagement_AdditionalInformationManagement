import {
    LOGIN_ERROR,
    LOGIN_REQUEST,
    LOGIN_SUCCESS,
    responses
} from '../../actions/user/userLogin-actions'

/**
 * Changes current state for logging in.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function checkIfLoggedInReducer(state = {}, action) {
    switch (action.type) {
        case LOGIN_REQUEST:
            return {
                response: responses.CHECKING_CREDENTIALS
            }
        case LOGIN_SUCCESS:
            window.localStorage.setItem('token', action.payload.token)
            window.localStorage.setItem('refreshToken', action.payload.refreshToken)
            window.localStorage.setItem('email', action.payload.email)
            window.localStorage.setItem('username', action.payload.username)
            window.localStorage.setItem('id', action.payload.id)
            window.localStorage.setItem('funds', action.payload.funds)

            return (action.payload)
        case LOGIN_ERROR:
            return (action.payload)
        default:
            return state
    }
}