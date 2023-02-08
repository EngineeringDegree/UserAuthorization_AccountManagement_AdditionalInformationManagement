import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'

const EditPacksWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [nat, setNat] = useState([])
    const [nation, setNation] = useState("")
    const [cardsCount, setCardsCount] = useState(0)
    const [price, setPrice] = useState(0)
    const [readyToUse, setReadyToUse] = useState(false)
    const [message, setMessage] = useState("")

    useEffect(() => {
        game_api("put/admin/modify/shopPack", "PUT", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id, name, nation, cardsCount, price, readyToUse
        }, (data) => {
            if(data.code === 200) {
                setMessage("Pack edited!")
                return
            }

            setMessage("Error editing shop pack.")
        })
    }, [name, nation, cardsCount, price, readyToUse])

    const getPack = () => {
        game_api("get/shopPack", "GET", {
            id
        }, (data) => {
            if(data.code === 200) {
                setName(data.data.name)
                setNation(data.data.nation)
                setPrice(data.data.price)
                setCardsCount(data.data.cardsCount)
                setReadyToUse(data.data.readyToUse)
                return
            }

            setMessage("Error getting shop pack.")
        })
    }

    useEffect(() => {
        game_api("get/cardAssets/all", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if(data.code === 200) {
                setNat(data.nations)
                getPack()
                return
            }

            setMessage("Error getting nations.")
        })
    }, [])

    const createNationSelectFromBackend = () => {
        let jsx = [<option value="">Select nation</option>]
        for(let i = 0; i < nat.length; i++){
            jsx.push(
                <option value={nat[i]._id}>{nat[i].name}</option>
            )
        }
        return jsx
    }

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Change shop pack</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/packs/edit"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Name" classes="standard-input" type="text" value={name} setter={setName} />
                    <div className="standard-input">
                        <select value={nation} onChange={(e) => setNation(e.target.value)}>
                        {
                            createNationSelectFromBackend()
                        }
                        </select>
                    </div>
                </div>

                <h5 className="title my-4 text-center">Advanced informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Cards in pack" classes="standard-input" type="number" value={cardsCount} setter={setCardsCount} />
                    <Input label="Pack price" classes="standard-input" type="number" value={price} setter={setPrice} />
                </div>

                <h5 className="title my-4 text-center">Available in game</h5>
                <div className='d-lg-flex text-center'>
                    <Input label="Can be used in game" classes="standard-input" type="checkbox" checked={readyToUse} setter={setReadyToUse} />
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

export default EditPacksWrapper