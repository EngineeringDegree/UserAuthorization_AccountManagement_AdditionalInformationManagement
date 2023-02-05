import React, { useState, useEffect } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"
import { getUsers, responses } from "../../actions/users/getUsers-actions"
import { LoadingButton } from '@mui/lab'
import Users from "./Users"
import ListingMenu from "../common/ListingMenu"
import PageMenu from "../common/PageMenu"

/**
 * Logic for displaying all users page.
 * @param {object} props 
 */
const AllUsersWrapper = (props) => {
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [username, setUsername] = useState("")
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [recordPerPage, setRecordsPerPage] = useState(10)
    const [status, setStatus] = useState(undefined)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsers(window.localStorage.getItem("email"), window.localStorage.getItem("token"), window.localStorage.getItem("refreshToken"), recordPerPage, username, page))
        setLoading(true)
    }, [])

    useEffect(() => {
        dispatch(getUsers(window.localStorage.getItem("email"), window.localStorage.getItem("token"), window.localStorage.getItem("refreshToken"), recordPerPage, username, page))
        setLoading(true)
    }, [username, recordPerPage, page])

    useSelector((state) => {
        if (checkIfEmptyObject(state.users) || responses.GETTING_USERS === state.users.response) {
            return
        }

        if (state.users.code !== 200) {
            switch (state.users.code) {
                case 401:
                case 404:
                case 406:
                default:
                    if (error !== "Something went wrong.") {
                        setError("Something went wrong.")
                    }
                    return
            }
        }

        if (loading) {
            setLoading(false)
            setUsers(state.users.users)
            setPage(state.users.page)
            setPages(state.users.pages)
            setStatus(state.users.status)
        }

    })

    /**
     * Sends request to ban user.
     * @param {string} id 
     * @param {string} reason 
     * @param {number} time 
     */
    const banUser = (id, reason, time) => {
        console.log(id, reason, time)
    }

    return (
        <div>
            <h2 className="title my-4 text-center">Users list</h2>
            <div className="box user-box mx-auto my-4 p-4">
                {(loading) ?
                    <div className="text-center">
                        <LoadingButton loading={true}> Loading </LoadingButton>
                    </div>
                    :
                    (error !== "") ?
                        <p className="orange-text">{error}</p>
                        :
                        (users.length === 0) ?
                            <p className="orange-text text-center">No users found</p>
                            :
                            <div className="control-box users-control-box">
                                <ListingMenu page={page} setPage={setPage} pages={pages} setPages={setPages} username={username} setUsername={setUsername} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <Users users={users} status={status} banUser={banUser} />
                                <PageMenu page={page} setPage={setPage} pages={pages} setPages={setPages} />
                            </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users
    }
}

const mapDispatchToProps = { getUsers }

export default connect(mapStateToProps, mapDispatchToProps)(AllUsersWrapper)