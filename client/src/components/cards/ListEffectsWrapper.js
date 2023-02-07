import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"
import { getRecords, responses } from "../../actions/cards/getEffects-actions"
import { LoadingButton } from '@mui/lab'
import { Link } from "react-router-dom"
import Lisiting from "./Listing"
import ListingMenu from "../common/ListingMenu"
import PageMenu from "../common/PageMenu"

const ListEffectsWrapper = (props) => {
    const linkRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [elements, setElements] = useState([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [recordPerPage, setRecordsPerPage] = useState(10)
    const [nameChanged, setNameChanged] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getRecords(recordPerPage, name, page))
        setLoading(true)
    }, [])

    useEffect(() => {
        dispatch(getRecords(recordPerPage, name, page))
        setLoading(true)
    }, [recordPerPage, page])

    useEffect(() => {
        dispatch(getRecords(recordPerPage, name, page))
        setNameChanged(true)
    }, [name])

    useSelector((state) => {
        if (checkIfEmptyObject(state.effects) || responses.GETTING_EFFECTS === state.effects.response) {
            return
        }

        if (state.effects.code !== 200) {
            switch (state.effects.code) {
                case 404:
                    linkRef.current.click()
                    return
                case 401:
                case 406:
                default:
                    if (error !== "Something went wrong.") {
                        setError("Something went wrong.")
                    }
                    return
            }
        }

        if (loading || nameChanged) {
            setLoading(false)
            setNameChanged(false)
            setElements(state.effects.effects)
            setPage(state.effects.page)
            setPages(state.effects.pages)
        }
    })

    return (
        <div>
            <Link to={"/logout"} style={{ display: "none" }} ref={linkRef}></Link>
            <h2 className="title my-4 text-center">Effects list</h2>
            <div className="box user-box mx-auto my-4 p-4">
                {(loading) ?
                    <div className="text-center">
                        <LoadingButton loading={true}> Loading </LoadingButton>
                    </div>
                    :
                    (error !== "") ?
                        <p className="orange-text">{error}</p>
                        :
                        (elements.length === 0) ?
                            <div>
                                <ListingMenu name="Name" page={page} setPage={setPage} pages={pages} setPages={setPages} username={name} setUsername={setName} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <p className="orange-text text-center">No effects found</p>
                            </div>
                            :
                            <div className="control-box users-control-box">
                                <ListingMenu name="Name" page={page} setPage={setPage} pages={pages} setPages={setPages} username={name} setUsername={setName} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <Lisiting list={elements} name={"effects"} />
                                <PageMenu page={page} setPage={setPage} pages={pages} setPages={setPages} />
                            </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        effects: state.effects
    }
}

const mapDispatchToProps = { getRecords }

export default connect(mapStateToProps, mapDispatchToProps)(ListEffectsWrapper)