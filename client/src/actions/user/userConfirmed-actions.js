import axios from 'axios'

export const CHANGE_CONFIRMED_REQUEST = 'change_confirmed_request'
export const CHANGE_CONFIRMED_SUCCESS = 'change_confirmed_success'
export const CHANGE_CONFIRMED_ERROR = 'change_confirmed_error'
export const responses = {
    CHANGING_CONFIRMED: "CHANGING CONFIRMED"
}

/**
 * Changes confirmed status.
 * @param {boolean} confirmed 
 * @param {string} user id of user to change.
 */
export function changeConfirmed(confirmed, user) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            confirmed,
            user
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/confirmed`
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
            type: CHANGE_CONFIRMED_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: CHANGE_CONFIRMED_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: CHANGE_CONFIRMED_ERROR,
            payload: res
        }
    }
}