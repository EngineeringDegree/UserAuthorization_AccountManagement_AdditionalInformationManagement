import {
    CHANGE_EMAIL_ERROR,
    CHANGE_EMAIL_REQUEST,
    CHANGE_EMAIL_SUCCESS,
    responses
} from '../../actions/user/userEmail-actions'

/**
 * Changes current state for changin email.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function emailReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_EMAIL_REQUEST:
            return {
                response: responses.CHANGING_EMAIL
            }
        case CHANGE_EMAIL_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            window.localStorage.setItem('email', action.payload.email)
            return (action.payload)
        case CHANGE_EMAIL_ERROR:
            return (action.payload)
        default:
            return state
    }
}