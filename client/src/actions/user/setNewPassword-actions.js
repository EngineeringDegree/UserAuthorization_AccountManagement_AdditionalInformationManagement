import axios from 'axios'

export const SET_PASSWORD_REQUEST = 'set_password_request'
export const SET_PASSWORD_SUCCESS = 'set_password_success'
export const SET_PASSWORD_ERROR = 'set_password_error'
export const responses = {
    CHANGING_PASSWORD: "CHANGING PASSWORD"
}

/**
 * Dispatch function for changing password.
 * @param {string} email 
 * @param {string} accessToken 
 * @param {string} password 
 * @param {string} repeatPassword 
 */
export function setNewPassword(email, accessToken, password, repeatPassword) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email,
            accessToken,
            password,
            repeatPassword
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/password`
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
            type: SET_PASSWORD_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: SET_PASSWORD_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: SET_PASSWORD_ERROR,
            payload: res
        }
    }
}