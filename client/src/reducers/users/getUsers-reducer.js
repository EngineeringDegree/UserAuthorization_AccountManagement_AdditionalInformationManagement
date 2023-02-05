import {
    GET_USERS_ERROR,
    GET_USERS_REQUEST,
    GET_USERS_SUCCESS,
    responses
} from '../../actions/users/getUsers-actions'

/**
 * Changes current state for checking if is owner.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function getUsersReducer(state = {}, action) {
    switch (action.type) {
        case GET_USERS_REQUEST:
            return {
                response: responses.GETTING_USERS
            }
        case GET_USERS_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case GET_USERS_ERROR:
            return (action.payload)
        default:
            return state
    }
}