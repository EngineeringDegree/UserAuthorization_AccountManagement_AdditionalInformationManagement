import {
    CHANGE_CONFIRMED_ERROR,
    CHANGE_CONFIRMED_REQUEST,
    CHANGE_CONFIRMED_SUCCESS,
    responses
} from '../../actions/user/userConfirmed-actions'

/**
 * Changes current state for changin if confirmed.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function confirmedReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_CONFIRMED_REQUEST:
            return {
                response: responses.CHANGING_CONFIRMED
            }
        case CHANGE_CONFIRMED_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case CHANGE_CONFIRMED_ERROR:
            return (action.payload)
        default:
            return state
    }
}