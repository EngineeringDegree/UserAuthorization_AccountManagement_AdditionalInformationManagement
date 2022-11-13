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
    const [justEntered, setJustEntered] = useState(true)
    const [error, setError] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [userAdmin, setUserAdmin] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserID] = useState('')

    const userInfoPack = {
        confirmed,
        userAdmin,
        username,
        email,
        password,
        setPassword,
        setEmail,
        setUsername,
        setUserAdmin,
        setConfirmed
    }

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
        setJustEntered(false)
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
                    if (el && !justEntered) {
                        el.click()
                    }
                    return
                case 406:
                    if (error !== "User you requested has not been found.") {
                        setError("User you requested has not been found.")
                    }
                    return
                default:
                    return
            }
        }

        if (!verified) {
            setVerified(true)

            if (confirmed !== state.getUserReducer.confirmed) {
                setConfirmed(state.getUserReducer.confirmed)
            }

            if (userAdmin !== state.getUserReducer.admin) {
                setUserAdmin(state.getUserReducer.admin)
            }

            if (username !== state.getUserReducer.username) {
                setUsername(state.getUserReducer.username)
            }

            if (email !== state.getUserReducer.email) {
                setEmail(state.getUserReducer.email)
            }

            if (userId !== state.getUserReducer.id) {
                setUserID(state.getUserReducer.id)
            }
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
            <UserInfoWrapper owner={owner} admin={admin} verified={verified} userInfoPack={userInfoPack} />
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