import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'

const EditFieldsWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [vision, setVision] = useState(0)
    const [message, setMessage] = useState("")
    const [readyToUse, setReadyToUse] = useState(false)

    const initHandler = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong getting data.")
            return
        }

        setName(data.data.name)
        setDescription(data.data.description)
        setMobility(data.data.basicMobilityCost)
        setDefence(data.data.basicDefence)
        setVision(data.data.visionCost)
        setReadyToUse(data.data.readyToUse)
    }

    useEffect(() => {
        game_api('get/field', "GET", {id: id}, initHandler)
    }, [])

    const handler = (data) => {
        if(data.code !== 200){
            setMessage("Cannot update field.")
            return
        }

        setMessage("Updated succesfully.")
    }

    useEffect(() => {
        game_api("put/admin/modify/field", "PUT", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id, name, description, basicMobilityCost: mobility, basicDefence: defence, visionCost: vision, readyToUse
        }, handler)
    })

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Edit Map field</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/fields/edit"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Field name" classes="standard-input" type="text" value={name} setter={setName} />
                    <Input label="Field description" classes="standard-input" type="text" value={description} setter={setDescription} />
                </div>

                <h5 className="title my-4 text-center">Influence on player stats</h5>
                <div className='d-lg-flex'>
                    <Input label="Basic defense" classes="standard-input" type="number" value={defence} setter={setDefence} />
                    <Input label="Mobility cost" classes="standard-input" type="number" value={mobility} setter={setMobility} />
                    <Input label="Vision cost" classes="standard-input" type="number" value={vision} setter={setVision} />
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

export default EditFieldsWrapper