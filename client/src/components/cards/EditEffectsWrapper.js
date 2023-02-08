import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'

const EditEffectsWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [cost, setCost] = useState("0/0/0/0")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [canUseOn, setCanUseOn] = useState(0)
    const [cooldown, setCooldown] = useState(0)
    const [duration, setDuration] = useState(0)
    const [stunImmunity, setStunImmunity] = useState(false)
    const [scareImmunity, setScareImmunity] = useState(false)
    const [silenceImmunity, setSilenceImmunity] = useState(false)
    const [stun, setStun] = useState(false)
    const [scare, setScare] = useState(false)
    const [silence, setSilence] = useState(false)
    const [readyToUse, setReadyToUse] = useState(false)
    const [message, setMessage] = useState("")

    const initHandler = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }

        setName(data.data.name)
        setDescription(data.data.description)
        setCost(data.data.cost)
        setMobility(data.data.mobility)
        setDefence(data.data.defence)
        setAttack(data.data.attack)
        setVision(data.data.vision)
        setCanUseOn(data.data.canUseOn)
        setCooldown(data.data.cooldown)
        setDuration(data.data.duration)
        setStunImmunity(data.data.stunImmunity)
        setScareImmunity(data.data.scareImmunity)
        setSilenceImmunity(data.data.silenceImmunity)
        setStun(data.data.stun)
        setScare(data.data.scare)
        setSilence(data.data.silence)
        setReadyToUse(data.data.setReadyToUse)
    }

    const handler = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }
        setMessage("Effect modified")
    }

    useEffect(() => {
        game_api('get/effect', "GET", {id: id}, initHandler)
    }, [])

    useEffect(() => {
        inputChanged()
    }, [name, description, cost, mobility, defence, attack, vision, canUseOn, cooldown, duration, stunImmunity, scareImmunity, silenceImmunity, stun, scare, silence, readyToUse])

    const inputChanged = () => {
        game_api('put/admin/modify/effect', "PUT", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id, name, description, cost, mobility, defence, attack, vision, canUseOn, cooldown, duration, stunImmunity, scareImmunity, silenceImmunity, stun, scare, silence, readyToUse
        }, handler)
    }

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Edit card effect</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/effects/edit"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Effect name" classes="effect standard-input" type="text" value={name} setter={setName} />
                    <Input label="Effect description" classes="description standard-input" type="text" value={description} setter={setDescription} />
                    <Input label="Effect cost" classes="cost standard-input" type="text" value={cost} setter={setCost} />
                </div>
                <div className='d-lg-flex'>
                    <Input label="Effect can be used on" classes="canUseOn standard-input" type="number" value={canUseOn} setter={setCanUseOn} />
                    <Input label="Effect cooldown" classes="cooldown standard-input" type="number" value={cooldown} setter={setCooldown} />
                    <Input label="Effect duration" classes="duration standard-input" type="number" value={duration} setter={setDuration} />
                </div>

                <h5 className="title my-4 text-center">Influence on player stats</h5>
                <div className='d-lg-flex'>
                    <Input label="Influence on mobility" classes="effect standard-input" type="number" value={mobility} setter={setMobility} />
                    <Input label="Influence on defence" classes="email standard-input" type="number" value={defence} setter={setDefence} />
                    <Input label="Influence on attack" classes="email standard-input" type="number" value={attack} setter={setAttack} />
                </div>
                <div className='d-lg-flex'>
                    <Input label="Influence on vision" classes="effect standard-input" type="number" value={vision} setter={setVision} />
                </div>

                <h5 className="title my-4 text-center">Additional effects statuses</h5>
                <h6 className="title my-4 text-center">Immunity to:</h6>
                <div className='d-lg-flex text-center'>
                    <Input label="Stun" classes="stun standard-input" type="checkbox" checked={stunImmunity} setter={setStunImmunity} />
                    <Input label="Scare" classes="scare standard-input" type="checkbox" checked={scareImmunity} setter={setScareImmunity} />
                    <Input label="Silence" classes="silence standard-input" type="checkbox" checked={silenceImmunity} setter={setSilenceImmunity} />
                </div>
                <h6 className="title my-4 text-center">Status if under effect:</h6>
                <div className='d-lg-flex text-center'>
                    <Input label="Stun" classes="stun standard-input" type="checkbox" checked={stun} setter={setStun} />
                    <Input label="Scare" classes="scare standard-input" type="checkbox" checked={scare} setter={setScare} />
                    <Input label="Silence" classes="silence standard-input" type="checkbox" checked={silence} setter={setSilence} />
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

export default EditEffectsWrapper
