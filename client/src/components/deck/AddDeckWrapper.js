import React, { useState, useEffect } from "react"
import { game_api } from "../../utils/api/api"
import { Link } from "react-router-dom"
import Input from "../common/Input"
import { MAX_DECK_SIZE } from "../../utils/deck/size"
import Card from "../cards/Card"

const AddDeckWrapper = () => {
    const [nations, setNations] = useState([])
    const [name, setName] = useState("")
    const [nation, setNation] = useState("")
    const [cards, setCards] = useState([])
    const [currentDeck, setCurrentDeck] = useState([])
    const [currentVisibleCards, setCurrentVisibleCards] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {
        game_api("get/cardAssets/all", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if (data.code === 200) {
                setNations(data.nations)
            }
        })

        game_api("get/user/cards/info", "GET", {
            id: window.localStorage.getItem("id"),
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if (data.code === 200) {
                setCards(data.cards)
            }
        })
    }, [])

    useEffect(() => {
        let visCards = [], initCurrentDeck = []

        for (let i = 0; i < cards.length; i++) {
            for (let j = 0; j < cards[i].card.nation.length; j++) {
                if (nation === cards[i].card.nation[j]) {
                    visCards.push(cards[i])
                    initCurrentDeck.push({
                        _id: cards[i].card._id,
                        quantity: 0
                    })
                }
            }
        }

        setCurrentDeck(initCurrentDeck)
        setCurrentVisibleCards(visCards)
    }, [nation])

    const create = () => {
        let filteredCards = []

        for (let i = 0; i < currentDeck.length; i++) {
            if (currentDeck[i].quantity != 0) {
                filteredCards.push(currentDeck[i])
            }
        }

        game_api("post/deck/new", "POST", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id: "1",
            name,
            nation,
            cards: filteredCards
        }, (data) => {
            if (data.code === 200) {
                setMessage("Deck created.")
            } else {
                setMessage("Something went wrong.")
            }
        })
    }

    const setNationsSelect = () => {
        let jsx = [<option value="" key="first option">Choose deck nation</option>]

        for (let i = 0; i < nations.length; i++) {
            jsx.push(
                <option key={i} value={nations[i]._id}>{nations[i].name}</option>
            )
        }

        return jsx
    }

    const changeQuantityTo = (e, i) => {
        let arr = [...currentDeck]
        arr[i].quantity = e.target.value / 1
        let count = 0
        for (let i = 0; i < arr.length; i++) {
            count += arr[i].quantity / 1
        }
        if (count <= MAX_DECK_SIZE) {
            setCurrentDeck(arr)
        }
    }

    const showCards = () => {
        let jsx = []

        for (let i = 0; i < currentVisibleCards.length; i++) {
            jsx.push(
                <div key={currentVisibleCards[i]._id} className="m-4">
                    <Card image={currentVisibleCards[i].card.image} quantity={currentVisibleCards[i].quantity} name={currentVisibleCards[i].card.name} description={currentVisibleCards[i].card.description} attack={currentVisibleCards[i].card.attack} mobility={currentVisibleCards[i].card.mobility} vision={currentVisibleCards[i].card.vision} defense={currentVisibleCards[i].card.defense} />
                    <input className="standard-input" type="range" min={0} max={currentVisibleCards[i].quantity} value={currentDeck[i].quantity} onChange={(e) => {
                        changeQuantityTo(e, i)
                    }} />
                </div>
            )
        }

        return jsx
    }

    const cardCount = () => {
        let count = 0
        for (let i = 0; i < currentDeck.length; i++) {
            count += currentDeck[i].quantity / 1
        }
        return count
    }

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Create new deck</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/decks"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex text-center'>
                    <Input label="Deck name" classes="standard-input" type="text" value={name} setter={setName} />
                    <select className="standard-input mx-auto" value={nation} onChange={(e) => setNation(e.target.value)}>
                        {
                            setNationsSelect()
                        }
                    </select>
                </div>
                <h5 className="title my-4 text-center">Choose cards and amount of it (deck must have 50 or less cards inside):</h5>
                <div className="d-flex justify-content-around" style={{ flexWrap: "wrap" }}>
                    {
                        showCards()
                    }
                </div>

                <p className="orange-text text-center"> Current card count: {cardCount()}</p>

                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={create} disabled={(name.trim() === "" || cardCount() === 0 || nation.trim() === "")}>
                        Create new deck
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

export default AddDeckWrapper