import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector, connect } from 'react-redux'
import UserInfoWrapper from "./UserInfoWrapper"
import CardsWrapper from "../cards/CardsWrapper"
import { getUser, responses } from "../../actions/user/getUser-actions"
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

/**
 * Wrapper for user profile
 */
const UserProfileWrapper = () => {
    const dispatch = useDispatch()
    const params = useParams()
    const [lastId, setLastId] = useState(params.id)
    const [owner, setOwner] = useState(false)
    const [admin, setAdmin] = useState(false)
    const [request, setRequest] = useState(false)
    const [verified, setVerified] = useState(false)
    const [error, setError] = useState('')

    const id = params.id
    if (lastId !== id) {
        setLastId(id)
    }

    useEffect(() => {
        setRequest(false)
        setVerified(false)
    }, [lastId])

    if (!request) {
        setRequest(true)
        dispatch(getUser(id, window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
    }

    useSelector((state) => {
        if (checkIfEmptyObject(state.getUserReducer) || responses.GETTING_USER === state.getUserReducer.response) {
            return
        }

        if (state.getUserReducer.code !== 200) {
            switch (state.getUserReducer.code) {
                case 401:
                case 404:
                    let el = document.getElementById('link-to-click-on-bad')
                    if (el && lastId === id) {
                        el.click()
                    }
                    break
                case 406:
                    if (error !== "User you requested has not been found.") {
                        setError("User you requested has not been found.")
                    }
                    break
                default:
                    return
            }
            return
        }

        if (!verified) {
            setVerified(true)
        }

        if (admin !== state.getUserReducer.isAdmin) {
            setAdmin(state.getUserReducer.isAdmin)
        }

        if (owner !== (state.getUserReducer.email === window.localStorage.getItem("email"))) {
            setOwner(state.getUserReducer.email === window.localStorage.getItem("email"))
        }
    })

    if (error !== "") {
        return (
            <div>
                {error}
                <p>Go back to main screen <Link to="/">here</Link></p>
            </div>
        )
    }

    return (
        <div>
            <Link to="/logout" className="hidden" id="link-to-click-on-bad"></Link>
            User profile wrapper for user {id}
            <UserInfoWrapper owner={owner} admin={admin} verified={verified} />
            <CardsWrapper owner={owner} verified={verified} />
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        getUserReducer: state.getUserReducer
    }
}

const mapDispatchToProps = { getUser }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileWrapper)