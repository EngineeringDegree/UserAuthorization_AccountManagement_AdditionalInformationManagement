import {
    ADD_ERROR,
    ADD_REQUEST,
    ADD_SUCCESS,
    responses
} from '../../actions/maps/addField-actions'

export default function addFieldReducer(state = {}, action) {
    switch (action.type) {
        case ADD_REQUEST:
            return {
                response: responses.ADDING
            }
        case ADD_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case ADD_ERROR:
            return (action.payload)
        default:
            return state
    }
}