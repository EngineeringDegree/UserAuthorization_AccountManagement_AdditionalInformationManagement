import React, { useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { useDispatch, useSelector, connect } from 'react-redux'
import { add, responses } from '../../actions/maps/addField-actions'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'

const AddFieldsWrapper = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [vision, setVision] = useState(0)
    const [message, setMessage] = useState("")

    const create = () => {
        dispatch(add(name, description, mobility, defence, vision))
    }

    useSelector((state) => {
        if (state.addField.response === responses.ADDING || checkIfEmptyObject(state.addField)) {
            return
        }

        if (state.addField === 'Network Error') {
            if (message !== 'Network Error. Try again later.') {
                setMessage('Network Error. Try again later.')
            }
            return
        }

        switch (state.addField.code) {
            case 200:
                if (message !== 'Field added.') {
                    setMessage('Field added.')
                }
                return
            case 400:
                if (message !== 'Bad request. Check if all fields are filled properly.') {
                    setMessage('Bad request. Check if all fields are filled properly.')
                }
                return
            case 401:
            case 404:
                if (message !== 'You are not an admin. You cannot add field!') {
                    setMessage('You are not an admin. You cannot add field!')
                }
                return
            default:
                return
        }
    })

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Add new map field</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/fields"} className={"standard-link"}>
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
                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={create}>
                        Create new map field
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        addField: state.addField
    }
}

const mapDispatchToProps = { add }

export default connect(mapStateToProps, mapDispatchToProps)(AddFieldsWrapper)