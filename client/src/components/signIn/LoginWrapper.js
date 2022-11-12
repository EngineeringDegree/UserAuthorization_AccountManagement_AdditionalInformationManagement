import { useEffect, useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { redirect } from "react-router-dom"
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

    const redirectOnLogin = useSelector((state) => {
        switch (state.userLogin.code) {
            case 200:
                return true
            case 400:
                if (error !== 'Bad data') {
                    setError('Bad data')
                }
                break
            case 401:
            case 404:
                if (error !== 'Bad login or password') {
                    setError('Bad login or password')
                }
            default:
                if (error !== '') {
                    setError('')
                }
        }
    })

    useEffect(() => {
        setEmailError('')
    }, [email])

    useEffect(() => {
        setPasswordError('')
    }, [password])

    /**
     * Sends request to backend if all data was formatted correctly.
     */
    const loginClick = () => {
        let error = false
        if (!notEmpty(email)) {
            setEmailError('Email cannot be empty!')
            error = true
        }

        if (notEmpty(email) && !isEmail(email)) {
            setEmailError('This field must be an email!')
            error = true
        }

        if (!notEmpty(password)) {
            setPasswordError('Password cannot be empty!')
            error = true
        }

        if (error) {
            return
        }

        dispatch(login(email, password))
    }

    if (redirectOnLogin) {
        // console.log("redirect")
        // return redirect('/')
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