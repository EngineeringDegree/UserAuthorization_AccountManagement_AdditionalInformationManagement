import axios from 'axios'

export const CHANGE_ADMIN_REQUEST = 'change_admin_request'
export const CHANGE_ADMIN_SUCCESS = 'change_admin_success'
export const CHANGE_ADMIN_ERROR = 'change_admin_error'
export const responses = {
    CHANGING_ADMIN: "CHANGING ADMIN"
}

/**
 * Dispatches function to change admin.
 * @param {boolean} admin 
 * @param {string} user id to change.
 */
export function changeAdmin(admin, user) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const patchBody = {
            email: window.localStorage.getItem('email'),
            token: window.localStorage.getItem('token'),
            refreshToken: window.localStorage.getItem('refreshToken'),
            admin,
            user
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `patch/user/admin`
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
            type: CHANGE_ADMIN_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: CHANGE_ADMIN_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: CHANGE_ADMIN_ERROR,
            payload: res
        }
    }
}