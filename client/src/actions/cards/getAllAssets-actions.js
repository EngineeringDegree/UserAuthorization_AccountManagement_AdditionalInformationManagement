import axios from 'axios'

export const GET_ASSETS_REQUEST = 'get_assets_request'
export const GET_ASSETS_SUCCESS = 'get_assets_success'
export const GET_ASSETS_ERROR = 'get_assets_error'
export const responses = {
    GETTING_ASSETS: "GETTING ASSETS"
}

export function getAllAssets() {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `get/cardAssets/all?email=${window.localStorage.getItem("email")}&token=${window.localStorage.getItem("token")}&refreshToken=${window.localStorage.getItem("refreshToken")}`
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
            type: GET_ASSETS_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: GET_ASSETS_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: GET_ASSETS_ERROR,
            payload: res
        }
    }
}