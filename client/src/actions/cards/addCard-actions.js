import axios from 'axios'

export const ADD_CARD_REQUEST = 'add_card_request'
export const ADD_CARD_SUCCESS = 'add_card_success'
export const ADD_CARD_ERROR = 'add_card_error'
export const responses = {
    ADDING_CARD: "ADDING CARD"
}

export function addCard(name, description, image, mobility, defence, attack, vision, resources, nation, effects, type, basicDeck) {
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
            image,
            mobility,
            defense: defence,
            attack,
            vision,
            resources,
            nation,
            effects,
            type,
            basicDeck
        }

        let response
        try {
            const address = process.env.REACT_APP_GAME_API + `post/admin/add/card`
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
            type: ADD_CARD_REQUEST
        }
    }

    /**
     * @returns dispatch object
     */
    function success(res) {
        return {
            type: ADD_CARD_SUCCESS,
            payload: res
        }
    }

    /**
     * @returns dispatch object
     */
    function error(res) {
        return {
            type: ADD_CARD_ERROR,
            payload: res
        }
    }
}