import axios from 'axios'

export const ADD_REQUEST = 'add_card_request'
export const ADD_SUCCESS = 'add_card_success'
export const ADD_ERROR = 'add_card_error'
export const responses = {
    ADDING: "ADDING"
}

export function add(name, description, mobility, defence, vision) {
    /**
     * Main dispatch function returned.
     */
    return async function (dispatch) {
        dispatch(request())
        const postBody = {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            name,
            description,
            basicMobilityCost: mobility,
            basicDefence: defence,
            visionCost: vision,
        }

        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `post/admin/add/field`
            response = await axios.post(address, postBody)
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
            type: ADD_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: ADD_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: ADD_ERROR,
            payload: res
        }
    }
}