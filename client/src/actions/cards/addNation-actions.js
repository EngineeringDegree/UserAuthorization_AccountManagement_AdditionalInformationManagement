import axios from 'axios'

export const ADD_NATION_REQUEST = 'add_nation_request'
export const ADD_NATION_SUCCESS = 'add_nation_success'
export const ADD_NATION_ERROR = 'add_nation_error'
export const responses = {
    ADDING_NATION: "ADDING NATION"
}

export function addNation(name, nation, mobility, defence, attack, vision) {
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
            nation,
            mobility,
            defence,
            attack,
            vision
        }

        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `post/admin/add/nation`
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
            type: ADD_NATION_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: ADD_NATION_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: ADD_NATION_ERROR,
            payload: res
        }
    }
}