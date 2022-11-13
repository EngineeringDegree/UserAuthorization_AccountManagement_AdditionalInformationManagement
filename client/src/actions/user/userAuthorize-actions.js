import axios from 'axios'

export const AUTH_REQUEST = 'auth_request'
export const AUTH_SUCCESS = 'auth_success'
export const AUTH_ERROR = 'auth_error'
export const responses = {
    AUTHORIZING: "AUTHORIZING"
}

/**
 * Dispatch request for logging in.
 * @param {string} email to check.
 * @param {string} accessToken to check.
 * @returns dispatch function for reducer.
 */
export function authorize(email, accessToken) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(authRequest())
        const patchBody = {
            email,
            accessToken
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/authorize`
            response = await axios.patch(address, patchBody)
            dispatch(authSuccess(response.data))
        } catch (e) {
            if (e.code === "ERR_NETWORK") {
                dispatch(authError(e.message))
            } else {
                dispatch(authError(e.response.data))
            }
        }
    }

    /**
     * @returns dispatch object
     */
    function authRequest() {
        return {
            type: AUTH_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function authSuccess(res) {
        return {
            type: AUTH_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function authError(res) {
        return {
            type: AUTH_ERROR,
            payload: res
        }
    }
}