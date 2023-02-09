import React, { useState, useEffect } from "react"
import { game_api } from "../../utils/api/api"
import { Link } from "react-router-dom"
import Input from "../common/Input"
import { MAX_DECK_SIZE } from "../../utils/deck/size"
import Card from "../cards/Card"

const EditDeckWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [nation, setNation] = useState("")
    const [nationName, setNationName] = useState("")
    const [cards, setCards] = useState([])
    const [currentDeck, setCurrentDeck] = useState([])
    const [currentVisibleCards, setCurrentVisibleCards] = useState([])
    const [message, setMessage] = useState("")

    useEffect(() => {

        game_api("get/user/deck", "GET", {
            id: id,
            userId: window.localStorage.getItem("id"),
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if (data.code === 200) {
                setNationName(data.nation)
                setName(data.deck.name)
                setNation(data.deck.nation)
                setCurrentDeck(data.deck.cards)
                let visCards = [], initCurrentDeck = []

                for (let i = 0; i < cards.length; i++) {
                    for (let j = 0; j < cards[i].card.nation.length; j++) {
                        if (nation === cards[i].card.nation[j]) {
                            visCards.push(cards[i])
                            let found = false

                            data.deck.cards.forEach(element => {
                                if (element._id === cards[i].card._id) {
                                    found = true

                                    initCurrentDeck.push({
                                        _id: cards[i].card._id,
                                        quantity: element.quantity
                                    })
                                }
                            })

                            if (!found) {
                                initCurrentDeck.push({
                                    _id: cards[i].card._id,
                                    quantity: 0
                                })
                            }
                        }
                    }
                }

                setCurrentDeck(initCurrentDeck)
                setCurrentVisibleCards(visCards)
            } else {
                setMessage("Something went wrong.")
            }
        })

    }, [cards])

    useEffect(() => {
        game_api("get/user/cards/info", "GET", {
            id: window.localStorage.getItem("id"),
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data2) => {
            if (data2.code === 200) {
                setCards(data2.cards)

            }
        })

    }, [])

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

    const saveDeck = () => {
        let filteredCards = []

        for (let i = 0; i < currentDeck.length; i++) {
            if (currentDeck[i].quantity != 0) {
                filteredCards.push(currentDeck[i])
            }
        }

        game_api("put/deck/edit", "PUT", {
            userId: window.localStorage.getItem("id"),
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            name: name,
            cards: filteredCards,
            id: id
        }, (data) => {
            if (data.code === 200) {
                setMessage("Deck edited succesfully.")
            } else {
                setMessage("Something went wrong.")
            }
        })
    }

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Manage deck</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/decks/edit"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex text-center'>
                    <Input label="Deck name" classes="standard-input" type="text" value={name} setter={setName} />
                    <Input label="Nation name" disabled classes="standard-input" type="text" value={nationName} setter={() => { }} />
                </div>
                <h5 className="title my-4 text-center">Choose cards and amount of it (deck must have 50 or less cards inside):</h5>
                <div className="d-flex justify-content-around" style={{ flexWrap: "wrap" }}>
                    {
                        showCards()
                    }
                </div>

                <p className="orange-text text-center"> Current card count: {cardCount()}</p>

                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={saveDeck} disabled={(name.trim() === "" || cardCount() === 0 || nation.trim() === "")}>
                        Save new deck
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

export default EditDeckWrapper