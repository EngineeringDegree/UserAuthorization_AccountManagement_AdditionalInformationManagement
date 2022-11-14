import {
    CHANGE_ADMIN_ERROR,
    CHANGE_ADMIN_REQUEST,
    CHANGE_ADMIN_SUCCESS,
    responses
} from '../../actions/user/userAdmin-actions'

/**
 * Changes current state for changin if admin.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function adminReducer(state = {}, action) {
    switch (action.type) {
        case CHANGE_ADMIN_REQUEST:
            return {
                response: responses.CHANGING_ADMIN
            }
        case CHANGE_ADMIN_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case CHANGE_ADMIN_ERROR:
            return (action.payload)
        default:
            return state
    }
}