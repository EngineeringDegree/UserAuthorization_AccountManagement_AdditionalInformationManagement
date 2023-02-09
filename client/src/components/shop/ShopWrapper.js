import React, { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { game_api, auth_api } from "../../utils/api/api"
import RecordsWrapper from "./RecordsWrapper"

const ShopWrapper = () => {
    const navigate = useNavigate()
    const [packs, setPacks] = useState([])
    const [coins, setCoins] = useState(0)
    const [message, setMessage] = useState("")

    const buyPack = (id, amount) => {
        game_api("post/user/packs", "POST", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            userId: "1",
            id
        }, (data) => {
            if (data.code === 200) {
                setMessage(`Pack bought. It costed ${amount}. You have ${coins - amount} funds left. Go to packs page to open it.`)
                setCoins(coins - amount)
                return
            }

            setMessage("Something went wrong. Try again later.")
        })
    }

    useEffect(() => {
        game_api("get/shop", "GET", {}, (data) => {
            if (data.code !== 200) {
                setPacks([])
            } else {
                setPacks(data.data)
            }
        })

        auth_api("get/checkIfLoggedIn", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if (data.code === 200) {
                setCoins(data.funds)
            }

            if (data.code === 401 || data.code === 404) {
                navigate("/logout")
            }
        })
    }, [])

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Shop</h2>
            <p className="orange-text text-center">You have <b>{coins}</b> left on your account.</p>
            <p className="orange-text text-center">Packs you can buy:</p>
            <div className="my-4">
                <RecordsWrapper packs={packs} buyPack={buyPack} coins={coins} />
            </div>
            <p className="orange-text my-4 text-center">{message}</p>
        </div>
    )
}

export default ShopWrapper