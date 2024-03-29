import {
    GET_USER_ERROR,
    GET_USER_REQUEST,
    GET_USER_SUCCESS,
    responses
} from '../../actions/user/getUser-actions'

/**
 * Changes current state for checking if is owner.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function getUserReducer(state = {}, action) {
    switch (action.type) {
        case GET_USER_REQUEST:
            return {
                response: responses.GETTING_USER
            }
        case GET_USER_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case GET_USER_ERROR:
            return (action.payload)
        default:
            return state
    }
}