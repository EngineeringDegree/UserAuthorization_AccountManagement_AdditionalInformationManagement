import { useEffect, useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import Input from "./Input"
import { notEmpty, isEmail } from "../../utils/signIn/inputChecks"
import { login } from '../../actions/user/userLogin-actions'

/**
 * LoginWrapper object to display
 * @returns jsx of the Login wrapper
 */
const LoginWrapper = () => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [error, setError] = useState('')
    const dispatch = useDispatch()

    useEffect(() => {
        setEmailError('')
    }, [email])

    useEffect(() => {
        setPasswordError('')
    }, [password])

    useSelector((state) => {
        console.log(state.userLogin)
        switch (state.userLogin.code) {
            case 400:
                if (error !== 'Bad request') {
                    setError('Bad request')
                }
                break;
            case 401:
            case 404:
                if (error !== 'Bad email or password') {
                    setError('Bad email or password')
                }
                break;
            default:
                break
        }
    })

    /**
     * Sends request to backend if all data was formatted correctly.
     */
    const loginClick = () => {
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

        if (!notEmpty(password)) {
            setPasswordError('Password cannot be empty!')
            err = true
        }

        if (err) {
            return
        }

        dispatch(login(email, password))
    }

    return (
        <div>
            <Input label="Email" classes="email standard-input login-email" type="text" value={email} setter={setEmail} error={emailError} />
            <Input label="Password" classes="password standard-input login-password" type="password" value={password} setter={setPassword} error={passwordError} />
            <button onClick={loginClick}>Login</button>
            {error}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        loginReducer: state.loginReducer
    }
}

const mapDispatchToProps = { login }

export default connect(mapStateToProps, mapDispatchToProps)(LoginWrapper)