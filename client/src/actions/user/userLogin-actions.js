import axios from 'axios'

export const LOGIN_REQUEST = 'login_request'
export const LOGIN_SUCCESS = 'login_success'
export const LOGIN_ERROR = 'login_error'
export const responses = {
    CHECKING_CREDENTIALS: "CHECKING CREDENTIALS"
}

/**
 * Dispatch request for logging in.
 * @param {string} email to check.
 * @param {string} password to check.
 * @returns dispatch function for reducer.
 */
export function login(email, password) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(loginRequest())
        const patchBody = {
            email,
            password
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/login`
            response = await axios.patch(address, patchBody)
            dispatch(loginSuccess(response.data))

            // Redirecting to main page. Should do it some other way (without reload) but currently out of ideas. To change. 
            window.location.pathname = '/'
        } catch (e) {
            dispatch(loginError(e.response.data))
        }
    }

    /**
     * @returns dispatch object
     */
    function loginRequest() {
        return {
            type: LOGIN_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function loginSuccess(res) {
        return {
            type: LOGIN_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function loginError(res) {
        return {
            type: LOGIN_ERROR,
            payload: res
        }
    }
}