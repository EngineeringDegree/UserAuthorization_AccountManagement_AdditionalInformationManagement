import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'

const AddPacksWrapper = () => {
    const [name, setName] = useState("")
    const [nat, setNat] = useState([])
    const [nation, setNation] = useState("")
    const [cardsCount, setCardsCount] = useState(0)
    const [price, setPrice] = useState(0)
    const [message, setMessage] = useState("")

    useEffect(() => {
        game_api("get/cardAssets/all", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, (data) => {
            if(data.code === 200) {
                setNat(data.nations)
            }
        })
    }, [])

    const create = () => {
        if(name === "" || nation === "" || cardsCount === 0 || price === 0 ){
            setMessage("Fill all fields before trying to create new pack!")
        }

        game_api("post/admin/add/shopPack", "POST", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            name, nation, cardsCount, price
        }, (data) => {
            if(data.code !== 200) {
                setMessage("Something went wrong!")
            } else {
                setMessage("Pack added!")
            }
        })
    }

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
            <h2 className="title my-4 text-center">Add new shop pack</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/nations"} className={"standard-link"}>
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

                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={create}>
                        Create new pack
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

export default AddPacksWrapper