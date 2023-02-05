import axios from 'axios'

export const BAN_USER_REQUEST = 'ban_user_request'
export const BAN_USER_SUCCESS = 'ban_user_success'
export const BAN_USER_ERROR = 'ban_user_error'
export const responses = {
    BANNING_USER: "BANNING USER"
}

/**
 * Dispatches function to ban user.
 * @param {string} id
 * @param {string} reason
 * @param {number} value
 */
export function banUser(id, reason, value) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            id,
            value,
            reason
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/ban`
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
            type: BAN_USER_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: BAN_USER_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: BAN_USER_ERROR,
            payload: res
        }
    }
}