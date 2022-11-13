import axios from 'axios'

export const GET_USER_REQUEST = 'is_owner_request'
export const GET_USER_SUCCESS = 'is_owner_success'
export const GET_USER_ERROR = 'is_owner_error'
export const responses = {
    GETTING_USER: "GETTING USER"
}

/**
 * Dispatch request for getting user.
 * @param {string} id to check.
 * @param {string} email to check.
 * @param {string} token to check.
 * @param {string} refreshToken to check.
 * @returns dispatch function for reducer.
 */
export function getUser(id, email, token, refreshToken) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `get/user?id=${id}&email=${email}&token=${token}&refreshToken=${refreshToken}`
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
            type: GET_USER_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_USER_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_USER_ERROR,
            payload: res
        }
    }
}