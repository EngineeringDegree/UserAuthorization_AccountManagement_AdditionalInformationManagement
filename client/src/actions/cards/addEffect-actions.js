import axios from 'axios'

export const ADD_EFFECT_REQUEST = 'add_effect_request'
export const ADD_EFFECT_SUCCESS = 'add_effect_success'
export const ADD_EFFECT_ERROR = 'add_effect_error'
export const responses = {
    ADDING_EFFECT: "ADDING EFFECT"
}

export function addEffect(name, description, cost, mobility, defence, attack, vision, canUseOn, cooldown, duration, stunImmunity, scareImmunity, silenceImmunity, stun, scare, silence) {
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
            cost,
            mobility,
            defence,
            attack,
            vision,
            canUseOn,
            cooldown,
            duration,
            stunImmunity,
            scareImmunity,
            silenceImmunity,
            stun,
            scare,
            silence
        }

        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `post/admin/add/effect`
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
            type: ADD_EFFECT_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: ADD_EFFECT_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: ADD_EFFECT_ERROR,
            payload: res
        }
    }
}