import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'

/**
 * Adding effects logic.
 * @returns adding effects jsx
 */
const AddEffectsWrapper = () => {
    const [name, setName] = useState("")
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
    const [message, setMessage] = useState("")

    const createEffect = () => {

    }

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Add new card effect</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/effects"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Effect name" classes="effect standard-input" type="text" value={name} setter={setName} />
                    <Input label="Effect cost" classes="cost standard-input" type="text" value={cost} setter={setCost} />
                    <Input label="Effect can be used on" classes="canUseOn standard-input" type="number" value={canUseOn} setter={setCanUseOn} />
                </div>
                <div className='d-lg-flex'>
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
                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={createEffect}>
                        Create new effect
                    </button>
                </div>
            </div>
            <p className='orange-text my-4'>{message}</p>
        </div>
    )
}

export default AddEffectsWrapper