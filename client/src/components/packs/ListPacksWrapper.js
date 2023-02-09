import React, { useState, useEffect, useRef } from "react"
import { LoadingButton } from '@mui/lab'
import { Link } from "react-router-dom"
import Lisiting from "../common/Listing"
import ListingMenu from "../common/ListingMenu"
import PageMenu from "../common/PageMenu"
import { game_api } from '../../utils/api/api'

const ListPacksWrapper = () => {
    const linkRef = useRef()
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [name, setName] = useState("")
    const [elements, setElements] = useState([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [recordPerPage, setRecordsPerPage] = useState(10)
    const [nameChanged, setNameChanged] = useState(false)

    const getRecords = (r, n, p) => {
        game_api("manage/get/shopPacks", "GET", {
            email: window.localStorage.getItem("email"),
            token: window.localStorage.getItem("token"),
            refreshToken: window.localStorage.getItem("refreshToken"),
            records: r,
            packName: n,
            page: p
        }, (data) => {
            if (data.code !== 200) {
                setError("Cannot list packs.")
                return
            }

            setElements(data.packs)
            setPage(data.page)
            setPages(data.pages)
            setLoading(false)
        })
    }

    useEffect(() => {
        getRecords(recordPerPage, name, page)
        setLoading(true)
    }, [])

    useEffect(() => {
        getRecords(recordPerPage, name, page)
        setLoading(true)
    }, [recordPerPage, page])

    useEffect(() => {
        getRecords(recordPerPage, name, page)
        setNameChanged(true)
    }, [name])


    return (
        <div>
            <Link to={"/logout"} style={{ display: "none" }} ref={linkRef}></Link>
            <h2 className="title my-4 text-center">Packs list</h2>
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
                                <p className="orange-text text-center">No packs found</p>
                            </div>
                            :
                            <div className="control-box users-control-box">
                                <ListingMenu name="Name" page={page} setPage={setPage} pages={pages} setPages={setPages} username={name} setUsername={setName} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <Lisiting list={elements} name={"packs"} />
                                <PageMenu page={page} setPage={setPage} pages={pages} setPages={setPages} />
                            </div>
                }
            </div>
        </div>
    )
}

export default ListPacksWrapper