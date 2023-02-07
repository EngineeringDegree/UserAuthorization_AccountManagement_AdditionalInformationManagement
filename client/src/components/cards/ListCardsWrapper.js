import React, { useState, useEffect, useRef } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"
import { getRecords, responses } from "../../actions/cards/getCardsRecords-actions"
import { LoadingButton } from '@mui/lab'
import { Link } from "react-router-dom"
import Lisiting from "../common/Listing"
import ListingMenu from "../common/ListingMenu"
import PageMenu from "../common/PageMenu"

const ListCardsWrapper = () => {
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
        if (checkIfEmptyObject(state.cards) || responses.GETTING === state.cards.response) {
            return
        }

        if (state.cards.code !== 200) {
            switch (state.cards.code) {
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
            setElements(state.cards.cards)
            setPage(state.cards.page)
            setPages(state.cards.pages)
        }
    })

    return (
        <div>
            <Link to={"/logout"} style={{ display: "none" }} ref={linkRef}></Link>
            <h2 className="title my-4 text-center">Cards list</h2>
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
                                <p className="orange-text text-center">No cards found</p>
                            </div>
                            :
                            <div className="control-box users-control-box">
                                <ListingMenu name="Name" page={page} setPage={setPage} pages={pages} setPages={setPages} username={name} setUsername={setName} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <Lisiting list={elements} name={"cards"} />
                                <PageMenu page={page} setPage={setPage} pages={pages} setPages={setPages} />
                            </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        cards: state.cards
    }
}

const mapDispatchToProps = { getRecords }

export default connect(mapStateToProps, mapDispatchToProps)(ListCardsWrapper)