import axios from 'axios'

export const GET_EFFECTS_REQUEST = 'get_effects_request'
export const GET_EFFECTS_SUCCESS = 'get_effects_success'
export const GET_EFFECTS_ERROR = 'get_effects_error'
export const responses = {
    GETTING_EFFECTS: "GETTING EFFECTS"
}

export function getRecords(records, name, page) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `manage/get/effects?email=${window.localStorage.getItem("email")}&token=${window.localStorage.getItem("token")}&refreshToken=${window.localStorage.getItem("refreshToken")}&records=${records}&effectName=${name}&page=${page}`
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
            type: GET_EFFECTS_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_EFFECTS_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_EFFECTS_ERROR,
            payload: res
        }
    }
}