import axios from 'axios'

export const NEW_PASSWORD_REQUEST = 'new_password_request'
export const NEW_PASSWORD_SUCCESS = 'new_password_success'
export const NEW_PASSWORD_ERROR = 'new_password_error'
export const responses = {
    ASKING_FOR_NEW_PASSWORD: "ASKING FOR NEW PASSWORD"
}

/**
 * Dispatch function for changing password.
 */
export function changePassword() {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            authorizationAddress: process.env.REACT_APP_CHANGE_PASSWORD_ADDRESS
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/askPassword`
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
            type: NEW_PASSWORD_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: NEW_PASSWORD_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: NEW_PASSWORD_ERROR,
            payload: res
        }
    }
}