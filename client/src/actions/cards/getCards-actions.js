import axios from 'axios'

export const GET_CARDS_REQUEST = 'auth_request'
export const GET_CARDS_SUCCESS = 'auth_success'
export const GET_CARDS_ERROR = 'auth_error'
export const responses = {
    GETTING_CARDS: "GETTING CARDS"
}

/**
 * Dispatch request for logging in.
 * @param {string} id to check.
 * @param {string} email to check.
 * @param {string} token to check.
 * @param {string} refreshToken to check.
 * @returns dispatch function for reducer.
 */
export function getUserCards(id, email, token, refreshToken) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `get/user/cards/info?id=${id}&email=${email}&token=${token}&refreshToken=${refreshToken}`
            response = await axios.get(address)
            dispatch(success(response.data))
        } catch (e) {
            if (e.code === "ERR_NETWORK") {
                dispatch(error(e.message))
            } else {
                dispatch(error(e.response.data))
            }
        }
    }

    /**
     * @returns dispatch object
     */
    function request() {
        return {
            type: GET_CARDS_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_CARDS_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_CARDS_ERROR,
            payload: res
        }
    }
}