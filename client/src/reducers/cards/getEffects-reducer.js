import {
    GET_EFFECTS_ERROR,
    GET_EFFECTS_REQUEST,
    GET_EFFECTS_SUCCESS,
    responses
} from '../../actions/cards/getEffects-actions'

export default function getEffectsReducer(state = {}, action) {
    switch (action.type) {
        case GET_EFFECTS_REQUEST:
            return {
                response: responses.GETTING_EFFECTS
            }
        case GET_EFFECTS_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case GET_EFFECTS_ERROR:
            return (action.payload)
        default:
            return state
    }
}