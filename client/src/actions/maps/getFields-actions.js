import axios from 'axios'

export const GET_REQUEST = 'get_request'
export const GET_SUCCESS = 'get_success'
export const GET_ERROR = 'get_error'
export const responses = {
    GETTING: "GETTING"
}

export function getRecords(records, name, page) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `manage/get/fields?email=${window.localStorage.getItem("email")}&token=${window.localStorage.getItem("token")}&refreshToken=${window.localStorage.getItem("refreshToken")}&records=${records}&fieldName=${name}&page=${page}`
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
            type: GET_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_ERROR,
            payload: res
        }
    }
}