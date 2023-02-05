import {
    ADD_TYPE_ERROR,
    ADD_TYPE_REQUEST,
    ADD_TYPE_SUCCESS,
    responses
} from '../../actions/cards/addType-actions'

export default function addTypeReducer(state = {}, action) {
    switch (action.type) {
        case ADD_TYPE_REQUEST:
            return {
                response: responses.ADDING_TYPE
            }
        case ADD_TYPE_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case ADD_TYPE_ERROR:
            return (action.payload)
        default:
            return state
    }
}