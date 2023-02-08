import React, { useEffect, useState } from 'react'
import { Link } from "react-router-dom"
import Input from '../common/Input'
import { game_api } from '../../utils/api/api'
import mongoose from 'mongoose'
import Card from './Card'

const EditCardsWrapper = () => {
    const address = window.location.pathname
    const split = address.split("/")
    const [id, setId] = useState(split[split.length - 1])
    const [name, setName] = useState("")
    const [description, setDescription] = useState("")
    const [image, setImage] = useState("")
    const [mobility, setMobility] = useState(0)
    const [defence, setDefence] = useState(0)
    const [attack, setAttack] = useState(0)
    const [vision, setVision] = useState(0)
    const [resources, setResources] = useState(0)
    const [basicDeck, setBasicDeck] = useState(0)
    const [type, setType] = useState([])
    const [displayType, setDisplayType] = useState([])
    const [nation, setNation] = useState([])
    const [effects, setEffects] = useState([])
    const [assets, setAssets] = useState({})
    const [readyToUse, setReadyToUse] = useState(false)
    const [message, setMessage] = useState("")

    const changeCard = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }

        setMessage("Card changed")
    }

    useEffect(() => {
        game_api("put/admin/modify/card", "PUT", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            id, name, image, type, nation, resources, attack, defense: defence, mobility, vision, effects, readyToUse, description, basicDeck
        }, changeCard)
    }, [name, image, type, nation, resources, attack, defence, mobility, vision, effects, readyToUse, description, basicDeck])

    const createCheckboxes = (data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }

        setAssets(data)
        game_api("get/cardById", "GET", {
            id
        }, (data2) => setCardInputs(data, data2))
    }

    const setCardInputs = (oldData, data) => {
        if(data.code !== 200){
            setMessage("Something went wrong")
            return
        }

        setName(data.data.name)
        setDescription(data.data.description)
        setImage(data.data.image)
        setMobility(data.data.mobility)
        setDefence(data.data.defense)
        setAttack(data.data.attack)
        setVision(data.data.vision)
        setResources(data.data.resources)
        setBasicDeck(data.data.basicDeck)
        setReadyToUse(data.data.readyToUse)
        setNation(data.data.nation)
        setType(data.data.type)
        setEffects(data.data.effects)

        for(let i = 0; i < data.data.nation.length; i++){
            document.getElementById(data.data.nation[i]).checked = true
        }

        for(let i = 0; i < data.data.type.length; i++){
            document.getElementById(data.data.type[i]).checked = true
            let dType = []
            for(let j = 0; j < oldData.types.length; j++) {
                if(mongoose.Types.ObjectId(data.data.type[i]).equals(mongoose.Types.ObjectId(oldData.types[i]._id))){
                    dType.push(oldData.types[i].name)
                    break
                }
            }
            setDisplayType(dType)
        }

        for(let i = 0; i < data.data.effects.length; i++){
            document.getElementById(data.data.effects[i]).checked = true
        }
    }

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
                <Input id={effectsCopy[i]._id} key={effectsCopy[i]._id} label={effectsCopy[i].name} classes="standard-input" type="checkbox" setter={() => effectCheckLogic(effectsCopy[i]._id)} />
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
                <Input id={arr[i]._id} key={arr[i]._id} label={arr[i].name} classes="standard-input" type="checkbox" setter={() => typeCheckLogic(arr[i]._id, arr[i].name)} />
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
                <Input key={arr[i]._id} id={arr[i]._id} label={arr[i].name} classes="standard-input" type="checkbox" setter={() => nationCheckLogic(arr[i]._id)} />
            )
        }

        return jsx
    }

    useEffect(() => {
        game_api("get/cardAssets/all", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken")
        }, createCheckboxes)
    }, [])

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Change card</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/manage/cards/edit"} className={"standard-link"}>
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

export default EditCardsWrapper