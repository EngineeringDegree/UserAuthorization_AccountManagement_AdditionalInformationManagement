import {
    CHANGE_USERNAME_ERROR,
    CHANGE_USERNAME_REQUEST,
    CHANGE_USERNAME_SUCCESS,
    responses
} from '../../actions/user/userUsername-actions'

/**
 * Changes current state for username change.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function usernameReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_USERNAME_REQUEST:
            return {
                response: responses.CHANGING_USERNAME
            }
        case CHANGE_USERNAME_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            window.localStorage.setItem('username', action.payload.username)

            return (action.payload)
        case CHANGE_USERNAME_ERROR:
            return (action.payload)
        default:
            return state
    }
}