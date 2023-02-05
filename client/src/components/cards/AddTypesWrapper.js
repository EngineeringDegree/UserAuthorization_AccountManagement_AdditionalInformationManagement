import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'
import { addType, responses } from '../../actions/cards/addType-actions'

/**
 * Adding types logic.
 * @returns adding types jsx
 */
const AddTypesWrapper = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [buffNearbyAllies, setBuffNearbyAllies] = useState("0/0/0/0/0")
    const [debuffNearbyEnemies, setDebuffNearbyEnemies] = useState("0/0/0/0/0")
    const [stunImmunity, setStunImmunity] = useState(false)
    const [scareImmunity, setScareImmunity] = useState(false)
    const [silenceImmunity, setSilenceImmunity] = useState(false)
    const [charge, setCharge] = useState(false)
    const [message, setMessage] = useState("")

    const createType = () => {
        dispatch(addType(name, description, mobility, defence, attack, vision, buffNearbyAllies, debuffNearbyEnemies, stunImmunity, scareImmunity, silenceImmunity, charge))
    }

    useSelector((state) => {
        if (state.addTypeReducer.response === responses.ADDING_TYPE || checkIfEmptyObject(state.addTypeReducer)) {
            return
        }

        if (state.addTypeReducer === 'Network Error') {
            if (message !== 'Network Error. Try again later.') {
                setMessage('Network Error. Try again later.')
            }
            return
        }

        switch (state.addTypeReducer.code) {
            case 200:
                if (message !== 'Type added.') {
                    setMessage('Type added.')
                }
                return
            case 400:
                if (message !== 'Bad request. Check if all fields are filled properly.') {
                    setMessage('Bad request. Check if all fields are filled properly.')
                }
                return
            case 401:
            case 404:
                if (message !== 'You are not an admin. You cannot add types!') {
                    setMessage('You are not an admin. You cannot add types!')
                }
                return
            default:
                return
        }
    })

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Add new card type</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/types"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Type name" classes="standard-input" type="text" value={name} setter={setName} />
                    <Input label="Type description" classes="standard-input" type="text" value={description} setter={setDescription} />
                </div>

                <h5 className="title my-4 text-center">Buffs and debuffs</h5>
                <div className='d-lg-flex'>
                    <Input label="Type buffs" classes="standard-input" type="text" value={buffNearbyAllies} setter={setBuffNearbyAllies} />
                    <Input label="Type debuffs" classes="standard-input" type="text" value={debuffNearbyEnemies} setter={setDebuffNearbyEnemies} />
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

                <h5 className="title my-4 text-center">Additional types statuses</h5>
                <h6 className="title my-4 text-center">Immunity to:</h6>
                <div className='d-lg-flex text-center'>
                    <Input label="Stun" classes="standard-input" type="checkbox" checked={stunImmunity} setter={setStunImmunity} />
                    <Input label="Scare" classes="standard-input" type="checkbox" checked={scareImmunity} setter={setScareImmunity} />
                    <Input label="Silence" classes="standard-input" type="checkbox" checked={silenceImmunity} setter={setSilenceImmunity} />
                </div>
                <h6 className="title my-4 text-center">Skills:</h6>
                <div className='d-lg-flex text-center'>
                    <Input label="Charge" classes="standard-input" type="checkbox" checked={charge} setter={setCharge} />
                </div>
                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={createType}>
                        Create new type
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        addTypeReducer: state.addTypeReducer
    }
}

const mapDispatchToProps = { addType }

export default connect(mapStateToProps, mapDispatchToProps)(AddTypesWrapper)