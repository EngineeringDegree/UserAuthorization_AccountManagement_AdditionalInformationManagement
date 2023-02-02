import { useEffect, useState } from "react"
import { Link, useParams } from 'react-router-dom'
import { useDispatch, useSelector, connect } from 'react-redux'
import UserInfoWrapper from "./UserInfoWrapper"
import CardsWrapper from "../cards/CardsWrapper"
import { getUser, responses as getUserResponses } from "../../actions/user/getUser-actions"
import { notEmpty, isEmail, isTrue, equals } from "../../utils/signIn/inputChecks"
import { changeUsername, responses as userUsernameResponses } from "../../actions/user/userUsername-actions"
import { changePassword, responses as userPasswordResponses } from "../../actions/user/userPassword-actions"
import { changeEmail, responses as userEmailResponses } from "../../actions/user/userEmail-actions"
import { changeConfirmed, responses as userConfirmedResponses } from "../../actions/user/userConfirmed-actions"
import { changeAdmin, responses as userAdminResponses } from "../../actions/user/userAdmin-actions"
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
    const [afterFirstRequest, setAfterFirstRequest] = useState(false)
    const [justEntered, setJustEntered] = useState(true)
    const [error, setError] = useState('')
    const [currentUsernameError, setCurrentUsernameError] = useState('')
    const [currentEmailError, setCurrentEmailError] = useState('')
    const [currentPasswordError, setCurrentPasswordError] = useState('')
    const [confirmed, setConfirmed] = useState(false)
    const [userAdmin, setUserAdmin] = useState(false)
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [userId, setUserID] = useState('')

    const askForNewEmail = () => {
        let err = false
        if (!notEmpty(password)) {
            setCurrentPasswordError('You must provide password!')
            err = true
        }

        if (!notEmpty(email)) {
            setCurrentEmailError('You must provide new email!')
            err = true
        }

        if (!isEmail(email)) {
            setCurrentEmailError('Email field must be email!')
            err = true
        }

        if (err) {
            return
        }

        dispatch(changeEmail(email, password))
    }

    useSelector((state) => {
        console.log(state.email)
    })

    const askForNewPassword = () => {
        dispatch(changePassword())
    }

    useSelector((state) => {
        console.log(state.password)
    })

    const userInfoPack = {
        confirmed,
        userAdmin,
        username,
        email,
        password,
        currentUsernameError,
        currentEmailError,
        currentPasswordError,
        setCurrentUsernameError,
        setCurrentPasswordError,
        setCurrentEmailError,
        setPassword,
        setEmail,
        setUsername,
        setUserAdmin,
        setConfirmed,
        askForNewEmail,
        askForNewPassword
    }

    useEffect(() => {
        if (afterFirstRequest) {
            if (!notEmpty(username)) {
                setCurrentUsernameError('Your name cannot be empty!')
                return
            }

            dispatch(changeUsername(username))
        }
    }, [username])

    useSelector((state) => {
        console.log(state.username)
    })

    useEffect(() => {
        if (afterFirstRequest) {
            dispatch(changeConfirmed(confirmed, id))
        }
    }, [confirmed])

    useSelector((state) => {
        console.log(state.confirmed)
    })

    useEffect(() => {
        if (afterFirstRequest) {
            dispatch(changeAdmin(userAdmin, id))
        }
    }, [admin])

    useSelector((state) => {
        console.log(state.admin)
    })

    const id = params.id
    if (lastId !== id) {
        setLastId(id)
    }

    useEffect(() => {
        setRequest(false)
        setVerified(false)
        setAfterFirstRequest(false)
    }, [lastId])

    if (!request) {
        setRequest(true)
        dispatch(getUser(id, window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
        setJustEntered(false)
    }

    useSelector((state) => {
        if (checkIfEmptyObject(state.getUserReducer) || getUserResponses.GETTING_USER === state.getUserReducer.response) {
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

            if (admin !== state.getUserReducer.isAdmin) {
                setAdmin(state.getUserReducer.isAdmin)
            }

            if (owner !== (state.getUserReducer.email === window.localStorage.getItem("email"))) {
                setOwner(state.getUserReducer.email === window.localStorage.getItem("email"))
            }

            setAfterFirstRequest(true)
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
            <UserInfoWrapper owner={owner} admin={admin} verified={verified} userInfoPack={userInfoPack} />
            {(owner) ?
                <CardsWrapper />
                :
                <></>
            }
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        getUserReducer: state.getUserReducer,
        username: state.username,
        password: state.password,
        email: state.email,
        confirmed: state.confirmed,
        admin: state.admin
    }
}

const mapDispatchToProps = { getUser, changeAdmin, changeConfirmed, changeEmail, changePassword, changeUsername }

export default connect(mapStateToProps, mapDispatchToProps)(UserProfileWrapper)