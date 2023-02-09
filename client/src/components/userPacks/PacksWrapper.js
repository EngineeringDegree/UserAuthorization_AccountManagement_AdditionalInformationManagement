import React, { useState, useEffect } from "react"
import { game_api } from "../../utils/api/api"
import Pack from "./Pack"
import Card from "../cards/Card"

const PacksWrapper = () => {
    const [packs, setPacks] = useState([])
    const [openedCards, setOpenedCards] = useState([])
    const [message, setMessage] = useState("")

    const getPacks = () => {
        game_api("get/user/packs", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if (data.code === 200) {
                setPacks(data.data)
            } else {
                setPacks([])
            }
        })
    }

    useEffect(() => {
        getPacks()
    }, [])

    const getRecords = () => {
        let jsx = []

        for (let i = 0; i < packs.length; i++) {
            jsx.push(
                <Pack key={packs[i]._id} id={packs[i]._id} name={packs[i].packName} openPack={openPack} />
            )
        }

        return jsx
    }

    const openPack = (id) => {
        game_api("patch/user/packs", "PATCH", {
            userId: "1",
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id: id
        }, (data) => {
            getPacks()
            if (data.code !== 200) {
                setMessage("Something went wrong, try again later.")
                setOpenedCards([])
                return
            }

            setOpenedCards(data.cards)
        })
    }

    const openedCardsData = () => {
        let jsx = []

        for (let i = 0; i < openedCards.length; i++) {
            jsx.push(
                <Card key={openedCards[i]._id} image={openedCards[i].cardDetails.image} name={openedCards[i].cardDetails.name} description={openedCards[i].cardDetails.description} attack={openedCards[i].cardDetails.attack} mobility={openedCards[i].cardDetails.mobility} defense={openedCards[i].cardDetails.defense} vision={openedCards[i].cardDetails.vision} quantity={openedCards[i].basicDeck} />
            )
        }

        return jsx
    }

    return (
        <div>
            <h2 className="title my-4 text-center">Your packs</h2>
            {packs.length === 0 ? <p className="orange-text text-center">Nothing to see here!</p> : <div className="my-4 d-flex justify-content-around" style={{ flexWrap: "wrap" }}>
                {getRecords()}
            </div>}

            <div className="my-4 d-flex justify-content-around" style={{ flexWrap: "wrap" }}>
                {openedCardsData()}
            </div>
            <p className="orange-text my-4">{message}</p>
        </div >
    )
}

export default PacksWrapper