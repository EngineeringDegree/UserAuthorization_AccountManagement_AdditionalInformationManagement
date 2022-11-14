import axios from 'axios'

export const CHANGE_EMAIL_REQUEST = 'change_email_request'
export const CHANGE_EMAIL_SUCCESS = 'change_email_success'
export const CHANGE_EMAIL_ERROR = 'change_email_error'
export const responses = {
    CHANGING_EMAIL: "CHANGING EMAIL"
}

/**
 * Dispatch function for changing email.
 * @param {string} newEmail 
 * @param {string} password to your account.
 */
export function changeEmail(newEmail, password) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            newEmail,
            authorizationAddress: process.env.REACT_APP_AUTHORIZATION_ADDRESS,
            password
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/email`
            response = await axios.patch(address, patchBody)
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
            type: CHANGE_EMAIL_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: CHANGE_EMAIL_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: CHANGE_EMAIL_ERROR,
            payload: res
        }
    }
}