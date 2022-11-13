import {
    GET_CARDS_ERROR,
    GET_CARDS_REQUEST,
    GET_CARDS_SUCCESS,
    responses
} from '../../actions/cards/getCards-actions'

/**
 * Changes current state for getting cards of user.
 * @param {object} state current state from previous action.
 * @param {object} action current action dispatched with data.
 * @returns new state.
 */
export default function getCardsReducer(state = {}, action) {
    switch (action.type) {
        case GET_CARDS_REQUEST:
            return {
                response: responses.GETTING_CARDS
            }
        case GET_CARDS_SUCCESS:
            return (action.payload)
        case GET_CARDS_ERROR:
            return (action.payload)
        default:
            return state
    }
}