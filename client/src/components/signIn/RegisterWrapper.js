import { useEffect, useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import Input from "./Input"
import { notEmpty, isEmail, isTrue, equals } from "../../utils/signIn/inputChecks"
import { register, responses } from '../../actions/user/userRegister-actions'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

/**
 * RegisterWrapper object to display
 * @returns jsx of the Register wrapper
 */
const RegisterWrapper = () => {
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [tac, setTAC] = useState(false)
    const [pp, setPP] = useState(false)
    const [emailError, setEmailError] = useState('')
    const [usernameError, setUsernameError] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [repeatPasswordError, setRepeatPasswordError] = useState('')
    const [tacError, setTACError] = useState(false)
    const [ppError, setPPError] = useState(false)
    const [error, setError] = useState('')
    const [reqeustSent, setRequestSent] = useState(false)
    const dispatch = useDispatch()

    useEffect(() => {
        setEmailError('')
    }, [email])

    useEffect(() => {
        setUsernameError('')
    }, [username])

    useEffect(() => {
        setPasswordError('')
        setRepeatPasswordError('')
    }, [password, repeatPassword])

    useEffect(() => {
        setTACError('')
    }, [tac])

    useEffect(() => {
        setPPError('')
    }, [pp])

    useSelector((state) => {
        if (state.userRegister.response === responses.REGISTERERING || checkIfEmptyObject(state.userRegister)) {
            return
        }

        if (reqeustSent) {
            setRequestSent(false)
        }

        if (state.userRegister === 'Network Error') {
            if (error !== 'Network Error. Try again later.') {
                setError('Network Error. Try again later.')
            }
            return
        }

        switch (state.userRegister.code) {
            case 400:
                if (error !== 'Bad request') {
                    setError('Bad request')
                }
                break;
            case 401:
                if (error !== 'Passwords do not match!') {
                    setError('Passwords do not match!')
                }
                break;
            case 406:
                if (error !== 'User with that email already exists!') {
                    setError('User with that email already exists!')
                }
                break;
            case 500:
                if (error !== 'Something went wrong. Try again later!') {
                    setError('Something went wrong. Try again later!')
                }
                break;
            default:
                break
        }
    })

    /**
     * Tries to register user.
     */
    const registerClick = () => {
        setRequestSent(true)
        setError('')
        let err = false
        if (!notEmpty(email)) {
            setEmailError('Email cannot be empty!')
            err = true
        }

        if (notEmpty(email) && !isEmail(email)) {
            setEmailError('This field must be an email!')
            err = true
        }

        if (!notEmpty(username)) {
            setUsernameError('Username cannot be empty!')
            err = true
        }

        if (!notEmpty(password)) {
            setPasswordError('Password cannot be empty!')
            err = true
        }

        if (!notEmpty(repeatPassword)) {
            setRepeatPasswordError('Repeat password cannot be empty!')
            err = true
        }

        if (!equals(password, repeatPassword)) {
            setPasswordError('Passwords are not identical!')
            setRepeatPasswordError('Passwords are not identical!')
            err = true
        }

        if (!isTrue(tac)) {
            setTACError('You need to accept Terms and Conditions!')
            err = true
        }

        if (!isTrue(pp)) {
            setPPError('You need to accept Privacy Policy!')
            err = true
        }

        if (err) {
            setRequestSent(false)
            return
        }

        dispatch(register(email, username, password, repeatPassword))
    }

    return (
        <div>
            <Input label="Email" classes="email standard-input register-email" type="text" value={email} setter={setEmail} error={emailError} />
            <Input label="Username" classes="username standard-input register-username" type="text" value={username} setter={setUsername} error={usernameError} />
            <Input label="Password" classes="password standard-input register-password" type="password" value={password} setter={setPassword} error={passwordError} />
            <Input label="Repeat Password" classes="repeat-password standard-input register-repeat-password" type="password" value={repeatPassword} setter={setRepeatPassword} error={repeatPasswordError} />
            <Input label="Terms and Conditions" classes="tac standard-input register-tac" type="checkbox" checked={tac} setter={setTAC} error={tacError} />
            <Input label="Privacy Policy" classes="pp standard-input register-pp" type="checkbox" checked={pp} setter={setPP} error={ppError} />
            <button onClick={registerClick} disabled={reqeustSent}>Register</button>
            {error}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        registerReducer: state.registerReducer
    }
}

const mapDispatchToProps = { register }

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWrapper)