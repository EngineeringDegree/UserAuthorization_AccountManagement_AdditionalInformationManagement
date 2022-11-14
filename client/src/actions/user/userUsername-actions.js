import axios from 'axios'

export const CHANGE_USERNAME_REQUEST = 'change_username_request'
export const CHANGE_USERNAME_SUCCESS = 'change_username_success'
export const CHANGE_USERNAME_ERROR = 'change_username_error'
export const responses = {
    CHANGING_USERNAME: "CHANGING USERNAME"
}

/**
 * Dispatches change username request.
 * @param {string} newUsername to change to.
 */
export function changeUsername(newUsername) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            newUsername
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/username`
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
            type: CHANGE_USERNAME_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: CHANGE_USERNAME_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: CHANGE_USERNAME_ERROR,
            payload: res
        }
    }
}