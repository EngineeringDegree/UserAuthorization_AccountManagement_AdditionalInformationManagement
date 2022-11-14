import { useEffect, useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import Input from "../common/Input"
import { notEmpty, isEmail } from "../../utils/signIn/inputChecks"
import { login, responses } from '../../actions/user/userLogin-actions'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

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
    const [reqeustSent, setRequestSent] = useState(false)
    const [justEntered, setJustEntered] = useState(true)
    const dispatch = useDispatch()

    useSelector((state) => {
        if (state.userLogin.response === responses.CHECKING_CREDENTIALS || checkIfEmptyObject(state.userLogin)) {
            return
        }

        if (reqeustSent) {
            setRequestSent(false)
        }

        if (state.userLogin === 'Network Error') {
            if (error !== 'Network Error. Try again later.') {
                setError('Network Error. Try again later.')
            }
            return
        }

        switch (state.userLogin.code) {
            case 200:
                let el = document.getElementById('link-to-click-on-succes')
                if (el && !justEntered) {
                    el.click()
                }
                return
            case 400:
                if (error !== 'Bad request') {
                    setError('Bad request')
                }
                return
            case 401:
            case 404:
                if (error !== 'Bad email or password') {
                    setError('Bad email or password')
                }
                return
            default:
                return
        }
    })

    /**
     * Sends request to backend if all data was formatted correctly.
     */
    const loginClickFunc = () => {
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

        if (!notEmpty(password)) {
            setPasswordError('Password cannot be empty!')
            err = true
        }

        if (err) {
            setRequestSent(false)
            return
        }

        dispatch(login(email, password))
        setJustEntered(false)
    }

    return (
        <div>
            <Input label="Email" classes="email standard-input login-email" type="text" value={email} setter={setEmail} error={emailError} errorSetter={setEmailError} />
            <Input label="Password" classes="password standard-input login-password" type="password" value={password} setter={setPassword} error={passwordError} errorSetter={setPasswordError} />
            <button onClick={loginClickFunc} disabled={reqeustSent}>Login</button>
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