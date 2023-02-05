import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'
import { addNation, responses } from '../../actions/cards/addNation-actions'

/**
 * Adding nation logic.
 * @returns adding nation jsx
 */
const AddNationsWrapper = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [message, setMessage] = useState("")

    const createNation = () => {
        dispatch(addNation(name, description, mobility, defence, attack, vision))
    }

    useSelector((state) => {
        if (state.addNationReducer.response === responses.ADDING_NATION || checkIfEmptyObject(state.addNationReducer)) {
            return
        }

        if (state.addNationReducer === 'Network Error') {
            if (message !== 'Network Error. Try again later.') {
                setMessage('Network Error. Try again later.')
            }
            return
        }

        switch (state.addNationReducer.code) {
            case 200:
                if (message !== 'Nation added.') {
                    setMessage('Nation added.')
                }
                return
            case 400:
                if (message !== 'Bad request. Check if all fields are filled properly.') {
                    setMessage('Bad request. Check if all fields are filled properly.')
                }
                return
            case 401:
            case 404:
                if (message !== 'You are not an admin. You cannot add nations!') {
                    setMessage('You are not an admin. You cannot add nations!')
                }
                return
            default:
                return
        }
    })

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Add new card nation</h2>
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

                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={createNation}>
                        Create new nation
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        addNationReducer: state.addNationReducer
    }
}

const mapDispatchToProps = { addNation }

export default connect(mapStateToProps, mapDispatchToProps)(AddNationsWrapper)