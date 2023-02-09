import React, { useState, useEffect, useRef } from "react"
import { LoadingButton } from '@mui/lab'
import { Link } from "react-router-dom"
import { game_api } from '../../utils/api/api'

const ListDeckWrapper = () => {
    const linkRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [elements, setElements] = useState([])

    const getRecords = () => {
        game_api("get/user/decks", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id: "1"
        }, (data) => {
            if (data.code !== 200) {
                setError("Cannot list decks.")
                return
            }

            setElements(data.decks)
            setLoading(false)
        })
    }

    useEffect(() => {
        getRecords()
    }, [])

    const deleteDeck = (id) => {
        game_api("decks/remove", "PATCH", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id: "1",
            deckId: id
        }, () => {
            getRecords()
        })
    }

    const formatListOfDecks = () => {
        let jsx = []

        for (let i = 0; i < elements.length; i++) {
            jsx.push(
                <div className="d-lg-flex my-4 justify-content-between">
                    <h5 className="title">{elements[i].name}: </h5>
                    <p className="orange-text">{elements[i].nation}</p>
                    <div className="d-flex" style={{ alignItems: "center" }}>
                        <Link to={`/decks/edit/${elements[i]._id}`}>
                            <button className="standard-btn mx-4">Edit deck</button>
                        </Link>
                        <button className="standard-btn" onClick={() => deleteDeck(elements[i]._id)}>Delete deck</button>
                    </div>
                </div>
            )
        }

        return jsx
    }

    return (
        <div>
            <Link to={"/logout"} style={{ display: "none" }} ref={linkRef}></Link>
            <h2 className="title my-4 text-center">Your decks</h2>
            <div className="box user-box mx-auto my-4 p-4">
                {(loading) ?
                    <div className="text-center">
                        <LoadingButton loading={true}> Loading </LoadingButton>
                    </div>
                    :
                    (error !== "") ?
                        <p className="orange-text">{error}</p>
                        :
                        (elements.length === 0) ?
                            <div>
                                <p className="orange-text text-center">No decks found</p>
                            </div>
                            :
                            <div className="control-box users-control-box">
                                {
                                    formatListOfDecks()
                                }
                            </div>
                }
            </div>
        </div>
    )
}

export default ListDeckWrapper