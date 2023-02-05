import {
    GET_ASSETS_ERROR,
    GET_ASSETS_REQUEST,
    GET_ASSETS_SUCCESS,
    responses
} from '../../actions/cards/getAllAssets-actions'

export default function getAllAssetsReducer(state = {}, action) {
    switch (action.type) {
        case GET_ASSETS_REQUEST:
            return {
                response: responses.GETTING_ASSETS
            }
        case GET_ASSETS_SUCCESS:
            if (action.payload.token) {
                window.localStorage.setItem('token', action.payload.token)
            }
            return (action.payload)
        case GET_ASSETS_ERROR:
            return (action.payload)
        default:
            return state
    }
}