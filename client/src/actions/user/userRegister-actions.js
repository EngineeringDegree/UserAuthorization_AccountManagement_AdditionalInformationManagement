import axios from 'axios'

export const REGISTER_REQUEST = 'register_request'
export const REGISTER_SUCCESS = 'register_success'
export const REGISTER_ERROR = 'register_error'
export const responses = {
    REGISTERERING: "REGISTERING"
}

/**
 * Tries to register user. 
 * @param {string} email 
 * @param {string} username 
 * @param {string} password 
 * @param {string} repeatPassword 
 * @returns dispatch function to use in reducer.
 */
export function register(email, username, password, repeatPassword) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(registerRequest())
        const postBody = {
            email,
            username,
            password,
            repeatPassword,
            authorizationAddress: process.env.REACT_APP_AUTHORIZATION_ADDRESS
        }

        let response
        try {
            const address = process.env.REACT_APP_AUTH_API + `post/register`
            response = await axios.post(address, postBody)
            dispatch(registerSuccess(response.data))
        } catch (e) {
            if (e.code === "ERR_NETWORK") {
                dispatch(registerError(e.message))
            } else {
                dispatch(registerError(e.response.data))
            }
        }
    }

    /**
     * @returns dispatch object
     */
    function registerRequest() {
        return {
            type: REGISTER_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function registerSuccess(res) {
        return {
            type: REGISTER_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function registerError(res) {
        return {
            type: REGISTER_ERROR,
            payload: res
        }
    }
}