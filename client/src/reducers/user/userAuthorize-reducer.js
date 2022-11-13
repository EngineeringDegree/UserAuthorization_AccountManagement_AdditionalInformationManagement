import {
    AUTH_ERROR,
    AUTH_REQUEST,
    AUTH_SUCCESS,
    responses
} from '../../actions/user/userAuthorize-actions'

/**
 * Changes current state for confirming account.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function authReducer(state = {}, action) {
    switch (action.type) {
        case AUTH_REQUEST:
            return {
                response: responses.AUTHORIZING
            }
        case AUTH_SUCCESS:
            return (action.payload)
        case AUTH_ERROR:
            return (action.payload)
        default:
            return state
    }
}