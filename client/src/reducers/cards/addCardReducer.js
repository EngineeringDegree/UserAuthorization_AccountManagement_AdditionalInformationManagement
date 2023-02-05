import {
    ADD_CARD_ERROR,
    ADD_CARD_REQUEST,
    ADD_CARD_SUCCESS,
    responses
} from '../../actions/cards/addCard-actions'

export default function addCardReducer(state = {}, action) {
    switch (action.type) {
        case ADD_CARD_REQUEST:
            return {
                response: responses.ADDING_CARD
            }
        case ADD_CARD_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case ADD_CARD_ERROR:
            return (action.payload)
        default:
            return state
    }
}