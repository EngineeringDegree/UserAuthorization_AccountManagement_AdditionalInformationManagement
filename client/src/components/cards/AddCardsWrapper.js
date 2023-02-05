import React, { useState, useEffect } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { useDispatch, useSelector, connect } from 'react-redux'
import Card from './Card'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'
import { LoadingButton } from '@mui/lab'
import { getAllAssets, responses as allAssetsResponse } from '../../actions/cards/getAllAssets-actions'
import { addCard, responses } from '../../actions/cards/addCard-actions'
import mongoose from 'mongoose'

/**
 * Adding card logic.
 * @returns adding card jsx
 */
const AddCardsWrapper = () => {
    const dispatch = useDispatch()
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [resources, setResources] = useState(0)
    const [basicDeck, setBasicDeck] = useState(0)
    const [message, setMessage] = useState("")
    const [type, setType] = useState([])
    const [displayType, setDisplayType] = useState([])
    const [nation, setNation] = useState([])
    const [effects, setEffects] = useState([])
    const [loadingAssets, setLoadingAssets] = useState(false)
    const [assets, setAssets] = useState({})

    useEffect(() => {
        dispatch(getAllAssets())
        setLoadingAssets(true)
    }, [])

    const createCard = () => {
        dispatch(addCard(name, description, image, mobility, defence, attack, vision, resources, nation, effects, type, basicDeck))
    }

    useSelector((state) => {
        if (state.getAllAssetsReducer.response === allAssetsResponse.GETTING_ASSETS || checkIfEmptyObject(state.getAllAssetsReducer)) {
            return
        }


        switch (state.getAllAssetsReducer.code) {
            case 200:
                if (loadingAssets) {
                    setAssets(state.getAllAssetsReducer)
                    setLoadingAssets(false)
                }
                break
            case 400:
            case 401:
            case 404:
            default:
                if (loadingAssets) {
                    setLoadingAssets(false)
                }
                return
        }
    })

    useSelector((state) => {
        if (state.addCardReducer.response === responses.ADDING_CARD || checkIfEmptyObject(state.addCardReducer)) {
            return
        }

        if (state.addCardReducer === 'Network Error') {
            if (message !== 'Network Error. Try again later.') {
                setMessage('Network Error. Try again later.')
            }
            return
        }

        switch (state.addCardReducer.code) {
            case 200:
                if (message !== 'Card added.') {
                    setMessage('Card added.')
                }
                return
            case 400:
                if (message !== 'Bad request. Check if all fields are filled properly.') {
                    setMessage('Bad request. Check if all fields are filled properly.')
                }
                return
            case 401:
            case 404:
                if (message !== 'You are not an admin. You cannot add card!') {
                    setMessage('You are not an admin. You cannot add card!')
                }
                return
            default:
                return
        }
    })

    const effectCheckLogic = (id) => {
        let effectsCopy = [...effects]

        let found = false
        for (let i = 0; i < effectsCopy.length; i++) {
            if (mongoose.Types.ObjectId(effectsCopy[i]).equals(mongoose.Types.ObjectId(id))) {
                found = true
                continue
            }
        }

        if (found) {
            const index = effectsCopy.indexOf(id)
            if (index > -1) {
                effectsCopy.splice(index, 1)
                setEffects(effectsCopy)
            }
        } else {
            effectsCopy.push(id)
            setEffects(effectsCopy)
        }
    }

    const createEffectsCheckboxes = () => {
        if (!assets.effects) {
            return
        }

        let effectsCopy = [...assets.effects]
        let jsx = []
        for (let i = 0; i < effectsCopy.length; i++) {
            jsx.push(
                <Input key={effectsCopy[i]._id} label={effectsCopy[i].name} classes="standard-input" type="checkbox" setter={() => effectCheckLogic(effectsCopy[i]._id)} />
            )
        }

        return jsx
    }

    const typeCheckLogic = (id, name) => {
        let arr = [...type]
        let arr2 = [...displayType]

        let found = false, it
        for (let i = 0; i < arr.length; i++) {
            if (mongoose.Types.ObjectId(arr[i]).equals(mongoose.Types.ObjectId(id))) {
                it = i
                found = true
                continue
            }
        }

        if (found) {
            if (it > -1) {
                arr.splice(it, 1)
                arr2.splice(it, 1)
                setType(arr)
                setDisplayType(arr2)
            }
        } else {
            arr.push(id)
            arr2.push(name)
            setType(arr)
            setDisplayType(arr2)
        }
    }

    const createTypesCheckboxes = () => {
        if (!assets.types) {
            return
        }

        let arr = [...assets.types]
        let jsx = []
        for (let i = 0; i < arr.length; i++) {
            jsx.push(
                <Input key={arr[i]._id} label={arr[i].name} classes="standard-input" type="checkbox" setter={() => typeCheckLogic(arr[i]._id, arr[i].name)} />
            )
        }

        return jsx
    }

    const nationCheckLogic = (id) => {
        let arr = [...nation]

        let found = false
        for (let i = 0; i < arr.length; i++) {
            if (mongoose.Types.ObjectId(arr[i]).equals(mongoose.Types.ObjectId(id))) {
                found = true
                continue
            }
        }

        if (found) {
            const index = arr.indexOf(id)
            if (index > -1) {
                arr.splice(index, 1)
                setNation(arr)
            }
        } else {
            arr.push(id)
            setNation(arr)
        }
    }

    const createNationsCheckboxes = () => {
        if (!assets.nations) {
            return
        }

        let arr = [...assets.nations]
        let jsx = []
        for (let i = 0; i < arr.length; i++) {
            jsx.push(
                <Input key={arr[i]._id} label={arr[i].name} classes="standard-input" type="checkbox" setter={() => nationCheckLogic(arr[i]._id)} />
            )
        }

        return jsx
    }


    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Add new card</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/cards"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>
                <h5 className="title my-4 text-center">Card view</h5>
                <Card image={image} name={name} type={(type.length === 0) ? "Unknown" : displayType[0]} description={description} attack={attack} mobility={mobility} vision={vision} defense={defence} quantity={basicDeck} />

                <h5 className="title my-4 text-center">Basic informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Card name" classes="standard-input" type="text" value={name} setter={setName} />
                    <Input label="Card description" classes="standard-input" type="text" value={description} setter={setDescription} />
                    <Input label="Card image" classes="standard-input" type="text" value={image} setter={setImage} />
                </div>

                <h5 className="title my-4 text-center">Deck wise informations</h5>
                <div className='d-lg-flex'>
                    <Input label="Card resources" classes="standard-input" type="text" value={resources} setter={setResources} />
                    <Input label="Cards in basic deck" classes="standard-input" type="text" value={basicDeck} setter={setBasicDeck} />
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

                <h5 className="title my-4 text-center">Additional informations</h5>
                <div className='d-lg-flex text-center'>
                    {(loadingAssets) ?
                        <div className="text-center">
                            <LoadingButton loading={true}> Loading </LoadingButton>
                        </div>
                        :
                        <div className='d-lg-flex mx-auto'>
                            <div>
                                <h6 className="title my-4 text-center">Card skills (effects)</h6>
                                {createEffectsCheckboxes()}
                            </div>
                            <div>
                                <h6 className="title my-4 text-center">Card nations</h6>
                                {createNationsCheckboxes()}
                            </div>
                            <div>
                                <h6 className="title my-4 text-center">Card type</h6>
                                {createTypesCheckboxes()}
                            </div>
                        </div>
                    }
                </div>

                <div className='text-center my-4'>
                    <button className="standard-btn" onClick={createCard}>
                        Create new card
                    </button>
                </div>
            </div>
            <p className='orange-text my-4 text-center'>{message}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        addCardReducer: state.addCardReducer,
        getAllAssetsReducer: state.getAllAssetsReducer
    }
}

const mapDispatchToProps = { addCard, getAllAssets }

export default connect(mapStateToProps, mapDispatchToProps)(AddCardsWrapper)