import axios from 'axios'

export const GET_USERS_REQUEST = 'get_users_request'
export const GET_USERS_SUCCESS = 'get_users_success'
export const GET_USERS_ERROR = 'get_users_error'
export const responses = {
    GETTING_USERS: "GETTING USERS"
}

/**
 * Dispatch request for getting user.
 * @param {number} records
 * @param {string} username
 * @param {number} page
 * @returns dispatch function for reducer.
 */
export function getUsers(records, username, page) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `get/users?email=${window.localStorage.getItem("email")}&token=${window.localStorage.getItem("token")}&refreshToken=${window.localStorage.getItem("refreshToken")}&records=${records}&username=${username}&page=${page}`
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
            type: GET_USERS_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_USERS_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_USERS_ERROR,
            payload: res
        }
    }
}