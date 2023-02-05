import {
    ADD_EFFECT_ERROR,
    ADD_EFFECT_REQUEST,
    ADD_EFFECT_SUCCESS,
    responses
} from '../../actions/cards/addEffect-actions'

export default function addEffectReducer(state = {}, action) {
    switch (action.type) {
        case ADD_EFFECT_REQUEST:
            return {
                response: responses.ADDING_EFFECT
            }
        case ADD_EFFECT_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case ADD_EFFECT_ERROR:
            return (action.payload)
        default:
            return state
    }
}