import axios from 'axios'

export const GET_CARDS_REQUEST = 'auth_request'
export const GET_CARDS_SUCCESS = 'auth_success'
export const GET_CARDS_ERROR = 'auth_error'
export const responses = {
    GETTING_CARDS: "GETTING CARDS"
}

/**
 * Dispatch request for logging in.
 * @param {string} email to check.
 * @param {string} accessToken to check.
 * @returns dispatch function for reducer.
 */
export function getCards(email, accessToken) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(getCardsRequest())
        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `patch/authorize`
            response = await axios.get(address)
            dispatch(getCardsSuccess(response.data))
        } catch (e) {
            if (e.code === "ERR_NETWORK") {
                dispatch(getCardsError(e.message))
            } else {
                dispatch(getCardsError(e.response.data))
            }
        }
    }

    /**
     * @returns dispatch object
     */
    function authRequest() {
        return {
            type: GET_CARDS_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function authSuccess(res) {
        return {
            type: GET_CARDS_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function authError(res) {
        return {
            type: GET_CARDS_ERROR,
            payload: res
        }
    }
}