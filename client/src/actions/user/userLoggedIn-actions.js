import axios from 'axios'

export const CHECK_LOGGED_REQUEST = 'check_logged_request'
export const CHECK_LOGGED_SUCCESS = 'check_logged_success'
export const CHECK_LOGGED_ERROR = 'check_logged_error'
export const responses = {
    REQUESTING_ACCOUNT_AUTHORIZATION: "REQUESTING ACCOUNT AUTHORIZATION",
    NO_TOKENS_EMAIL: "NO TOKENS OR EMAIL"
}

/**
 * Dispatch request for checking if logged in.
 * @param {string} email to check.
 * @param {string} token to check.
 * @param {*} refreshToken to check.
 * @returns dispatch function for reducer.
 */
export function userLoggedIn(email, token, refreshToken) {

    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        if (!email || !token || !refreshToken) {
            dispatch(checkIfLoggedError({ response: responses.NO_TOKENS_EMAIL }))
            alert('Email, token or refreshToken not specified.')
            return
        }

        dispatch(checkIfLoggedRequest())
        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `get/checkIfLoggedIn?email=${email}&token=${token}&refreshToken=${refreshToken}`
            response = await axios.get(address)
            dispatch(checkIfLoggedSuccess(response))
        } catch (e) {
            dispatch(checkIfLoggedError(e.response.data))
        }
    }

    /**
     * @returns dispatch object
     */
    function checkIfLoggedRequest() {
        return {
            type: CHECK_LOGGED_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function checkIfLoggedSuccess(res) {
        return {
            type: CHECK_LOGGED_SUCCESS,
            payload: res.data
        }
    }

    /**
     * @returns dispatch object
     */
    function checkIfLoggedError(res) {
        return {
            type: CHECK_LOGGED_ERROR,
            payload: res
        }
    }
}