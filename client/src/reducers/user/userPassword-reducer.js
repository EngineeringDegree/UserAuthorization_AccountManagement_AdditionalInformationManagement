import {
    NEW_PASSWORD_ERROR,
    NEW_PASSWORD_REQUEST,
    NEW_PASSWORD_SUCCESS,
    responses
} from '../../actions/user/userPassword-actions'

/**
 * Changes current state for changing password.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function passwordReducer(state = {}, action) {
    switch (action.type) {
        case NEW_PASSWORD_REQUEST:
            return {
                response: responses.ASKING_FOR_NEW_PASSWORD
            }
        case NEW_PASSWORD_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case NEW_PASSWORD_ERROR:
            return (action.payload)
        default:
            return state
    }
}