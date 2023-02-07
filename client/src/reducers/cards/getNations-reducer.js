import {
    GET_ERROR,
    GET_REQUEST,
    GET_SUCCESS,
    responses
} from '../../actions/cards/getNations-actions'

export default function getNationsReducer(state = {}, action) {
    switch (action.type) {
        case GET_REQUEST:
            return {
                response: responses.GETTING
            }
        case GET_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case GET_ERROR:
            return (action.payload)
        default:
            return state
    }
}