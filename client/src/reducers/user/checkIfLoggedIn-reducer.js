import {
    CHECK_LOGGED_ERROR,
    CHECK_LOGGED_REQUEST,
    CHECK_LOGGED_SUCCESS,
    responses
} from '../../actions/user/userLoggedIn-actions'

/**
 * Changes current state for checking if logged in.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function checkIfLoggedInReducer(state = {}, action) {
    switch (action.type) {
        case CHECK_LOGGED_REQUEST:
            return {
                response: responses.REQUESTING_ACCOUNT_AUTHORIZATION
            }
        case CHECK_LOGGED_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case CHECK_LOGGED_ERROR:
            return (action.payload)
        default:
            return state
    }
}