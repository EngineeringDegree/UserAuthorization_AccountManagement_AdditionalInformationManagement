import axios from "axios"

export const game_api = async (endpoint, method = "POST", body, callback) => {

    let config = {
        method,
        url: `${process.env.REACT_APP_GAME_API}${endpoint}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }

    if(body){
        if(method === "GET") {
            config.params = body
        } else {
            config.data = body
        }
    }

    axios(config).then(res => {
        callback(res.data)
    }).catch(e => {
        if (e.code === "ERR_NETWORK") {
            callback(e.message)
        } else {
            callback(e.response.data)
        }
    })
}

export const auth_api = async (endpoint, method = "POST", body, callback) => {

    let config = {
        method,
        url: `${process.env.REACT_APP_AUTH_API}${endpoint}`,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json'
        }
    }

    if(body){
        if(method === "GET") {
            config.params = body
        } else {
            config.data = body
        }
    }

    axios(config).then(res => {
        callback(res.data)
    }).catch(e => {
        if (e.code === "ERR_NETWORK") {
            callback(e.message)
        } else {
            callback(e.response.data)
        }
    })
}