import React, { useEffect } from "react"
import Card from "../cards/Card"
import { game_api } from '../../utils/api/api'

/**
 * Wraps all main screen elements.
 */
const MainWrapper = () => {

    useEffect(() => {
        game_api("get/user/decks", "GET", {
            id: "1",
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, () => { })
    }, [])

    return (
        <div className="text-center p-4">
            <h2 className="title mb-4">Welcome to Clash of Myhs!</h2>

            <p>It is a platform designed for playing card strategy game.</p>
            <p>You can as well collect cards, make best deck in the world or just govern your account.</p>
            <p className="mb-5">Here are some interesting cards:</p>
            <div className="d-lg-flex justify-content-around">
                <Card name={"Zeus"} type={"Mage"} description={"Powerfull greek king of the thunder and other gods."} attack={6} mobility={4} vision={6} defense={3} image={"/img/zeus.png"} />
                <Card name={"Hippeis"} type={"Cavalary"} description={"Greek cavalary unit. Quick and powerfull in attack and scouting but not so great in defense."} attack={5} mobility={8} vision={5} defense={1} image={"/img/greek_cavalary.png"} />
                <Card name={"Loki"} type={"Assasin"} description={"Nordic god of mischief. Great mobility and vision. Unique dissapearing skill."} attack={3} mobility={7} vision={8} defense={1} image={"/img/loki.png"} />
            </div>
        </div>
    )
}

export default MainWrapper