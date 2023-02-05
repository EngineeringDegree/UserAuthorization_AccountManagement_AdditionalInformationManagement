import axios from 'axios'

export const ADD_TYPE_REQUEST = 'add_type_request'
export const ADD_TYPE_SUCCESS = 'add_type_success'
export const ADD_TYPE_ERROR = 'add_type_error'
export const responses = {
    ADDING_TYPE: "ADDING TYPE"
}

export function addType(name, type, mobility, defence, attack, vision, buffNearbyAllies, debuffNearbyEnemies, stunImmunity, scareImmunity, silenceImmunity, charge) {
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
            type,
            mobility,
            defence,
            attack,
            vision,
            buffNearbyAllies,
            debuffNearbyEnemies,
            stunImmunity,
            scareImmunity,
            silenceImmunity,
            charge
        }

        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `post/admin/add/type`
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
            type: ADD_TYPE_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: ADD_TYPE_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: ADD_TYPE_ERROR,
            payload: res
        }
    }
}