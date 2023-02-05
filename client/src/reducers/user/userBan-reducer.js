import {
    BAN_USER_ERROR,
    BAN_USER_REQUEST,
    BAN_USER_SUCCESS,
    responses
} from '../../actions/user/userBan-actions'

/**
 * Changes current state for banning an user.
 * @param {object} state
 * @param {object} action
 * @returns new state.
 */
export default function banUserReducer(state = {}, action) {
    switch (action.type) {
        case BAN_USER_REQUEST:
            return {
                response: responses.BANNING_USER
            }
        case BAN_USER_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case BAN_USER_ERROR:
            return (action.payload)
        default:
            return state
    }
}