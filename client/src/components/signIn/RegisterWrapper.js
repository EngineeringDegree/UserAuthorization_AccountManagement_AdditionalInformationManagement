import { useEffect, useState } from "react"
import { useDispatch, connect } from 'react-redux'
import Input from "./Input"
import { notEmpty, isEmail, isTrue, equals } from "../../utils/signIn/inputChecks"

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

    }
}

const mapDispatchToProps = {}

export default connect(mapStateToProps, mapDispatchToProps)(RegisterWrapper)