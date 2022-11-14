import {
    SET_PASSWORD_ERROR,
    SET_PASSWORD_REQUEST,
    SET_PASSWORD_SUCCESS,
    responses
} from '../../actions/user/setNewPassword-actions'

/**
 * Changes current state for setting password.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function setPasswordReducer(state = {}, action) {
    switch (action.type) {
        case SET_PASSWORD_REQUEST:
            return {
                response: responses.CHANGING_PASSWORD
            }
        case SET_PASSWORD_SUCCESS:
            return (action.payload)
        case SET_PASSWORD_ERROR:
            return (action.payload)
        default:
            return state
    }
}