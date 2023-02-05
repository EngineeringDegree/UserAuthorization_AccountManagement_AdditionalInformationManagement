import {
    ADD_NATION_ERROR,
    ADD_NATION_REQUEST,
    ADD_NATION_SUCCESS,
    responses
} from '../../actions/cards/addNation-actions'

export default function addTypeReducer(state = {}, action) {
    switch (action.type) {
        case ADD_NATION_REQUEST:
            return {
                response: responses.ADDING_NATION
            }
        case ADD_NATION_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case ADD_NATION_ERROR:
            return (action.payload)
        default:
            return state
    }
}