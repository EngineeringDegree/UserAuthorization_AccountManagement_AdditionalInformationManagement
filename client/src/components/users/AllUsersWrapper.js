import React, { useState, useEffect } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { getUser, responses as getUserResponses } from "../../actions/user/getUser-actions"
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

/**
 * Logic for displaying all users page.
 * @param {object} props 
 */
const AllUsersWrapper = (props) => {
    const [loading, setLoading] = useState(false)
    const [loadingUsers, setLoadingUsers] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [page, setPage] = useState(1)
    const [recordPerPage, setRecordsPerPage] = useState(10)
    const dispatch = useDispatch()

    useEffect(() => {
        setLoading(true)
        setLoadingUsers(true)
        dispatch(getUser(window.localStorage.getItem("id"), window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
        // dispatch()
    }, [])

    useSelector((state) => {
        if (checkIfEmptyObject(state.getUserReducer) || getUserResponses.GETTING_USER === state.getUserReducer.response) {
            return
        }

        if (loading) {
            setLoading(false)
        }

        if (state.getUserReducer.code !== 200) {
            switch (state.getUserReducer.code) {
                case 401:
                case 404:
                case 406:
                default:
                    return
            }
        }

        if (admin !== state.getUserReducer.admin) {
            setAdmin(state.getUserReducer.admin)
        }

    })

    return (
        <>
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        getUserReducer: state.getUserReducer,
    }
}

const mapDispatchToProps = { getUser }

export default connect(mapStateToProps, mapDispatchToProps)(AllUsersWrapper)