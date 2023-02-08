import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'

const EditNationsWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [readyToUse, setReadyToUse] = useState(false)
    const [message, setMessage] = useState("")

    const initHandler = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }

        setName(data.data.name)
        setDescription(data.data.description)
        setMobility(data.data.mobility)
        setDefence(data.data.defence)
        setAttack(data.data.attack)
        setVision(data.data.vision)
        setReadyToUse(data.data.readyToUse)
    }

    useEffect(() => {
        game_api('get/nation', "GET", {id: id}, initHandler)
    }, [])

    const handler = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }
        setMessage("Nation modified")
    }

    useEffect(() => {
        inputChanged()
    }, [name, description, mobility, defence, attack, vision, readyToUse])

    const inputChanged = () => {
        game_api('put/admin/modify/nation', "PUT", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id, name, description, mobility, defence, attack, vision, readyToUse
        }, handler)
    }

    return (
        <>
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Change card nation</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/nations/edit"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Nation name" classes="standard-input" type="text" value={name} setter={setName} />
                    <Input label="Nation description" classes="standard-input" type="text" value={description} setter={setDescription} />
                </div>

                <h5 className="title my-4 text-center">Influence on player stats</h5>
                <div className='d-lg-flex'>
                    <Input label="Influence on mobility" classes="standard-input" type="number" value={mobility} setter={setMobility} />
                    <Input label="Influence on defence" classes="standard-input" type="number" value={defence} setter={setDefence} />
                    <Input label="Influence on attack" classes="standard-input" type="number" value={attack} setter={setAttack} />
                </div>
                <div className='d-lg-flex'>
                    <Input label="Influence on vision" classes="standard-input" type="number" value={vision} setter={setVision} />
                </div>

                <h5 className="title my-4 text-center">Available in game</h5>
                <div className='d-lg-flex text-center'>
                    <Input label="Can be used in game" classes="standard-input" type="checkbox" checked={readyToUse} setter={setReadyToUse} />
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
        </>
    )
}

export default EditNationsWrapper