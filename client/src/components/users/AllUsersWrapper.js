import React, { useState, useEffect } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"
import { getUsers, responses } from "../../actions/users/getUsers-actions"
import { banUser, responses as banUserResponse } from "../../actions/user/userBan-actions"
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
    const [successMessage, setSuccessMessage] = useState("")
    const [username, setUsername] = useState("")
    const [users, setUsers] = useState([])
    const [page, setPage] = useState(1)
    const [pages, setPages] = useState(1)
    const [recordPerPage, setRecordsPerPage] = useState(10)
    const [status, setStatus] = useState(undefined)
    const [usernameChanged, setUsernameChanged] = useState(false)
    const [banning, setBanning] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        dispatch(getUsers(recordPerPage, username, page))
        setLoading(true)
    }, [])

    useEffect(() => {
        dispatch(getUsers(recordPerPage, username, page))
        setLoading(true)
    }, [recordPerPage, page])

    useEffect(() => {
        dispatch(getUsers(recordPerPage, username, page))
        setUsernameChanged(true)
    }, [username])

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

        if (loading || usernameChanged) {
            setLoading(false)
            setUsernameChanged(false)
            setUsers(state.users.users)
            setPage(state.users.page)
            setPages(state.users.pages)
            setStatus(state.users.status)
        }
    })

    useSelector((state) => {
        if (checkIfEmptyObject(state.userBanned) || banUserResponse.BANNING_USER === state.userBanned.response) {
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

        if (banning) {
            setBanning(false)
            if (successMessage !== "User banned succesfully") {
                setSuccessMessage("User banned succesfully")
            }
        }
    })

    /**
     * Sends request to ban user.
     * @param {string} id 
     * @param {string} reason 
     * @param {number} time 
     */
    const banCertainUser = (id, reason, time) => {
        dispatch(banUser(id, reason, time))
        setBanning(true)
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
                            <div>
                                <ListingMenu name="Username" page={page} setPage={setPage} pages={pages} setPages={setPages} username={username} setUsername={setUsername} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <p className="orange-text text-center">No users found</p>
                            </div>
                            :
                            <div className="control-box users-control-box">
                                <ListingMenu name="Username" page={page} setPage={setPage} pages={pages} setPages={setPages} username={username} setUsername={setUsername} recordPerPage={recordPerPage} setRecordsPerPage={setRecordsPerPage} />
                                <p className="orange-text text-center">{successMessage}</p>
                                <Users users={users} status={status} banCertainUser={banCertainUser} />
                                <PageMenu page={page} setPage={setPage} pages={pages} setPages={setPages} />
                            </div>
                }
            </div>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        users: state.users,
        userBanned: state.userBanned
    }
}

const mapDispatchToProps = { getUsers, banUser }

export default connect(mapStateToProps, mapDispatchToProps)(AllUsersWrapper)