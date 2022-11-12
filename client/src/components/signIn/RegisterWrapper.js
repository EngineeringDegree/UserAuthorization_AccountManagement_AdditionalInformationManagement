import { useEffect, useState } from "react"
import { useDispatch, connect } from 'react-redux'
import Input from "./Input"
import { notEmpty, isEmail } from "../../utils/signIn/inputChecks"

/**
 * RegisterWrapper object to display
 * @returns jsx of the Register wrapper
 */
const RegisterWrapper = () => {
    const [email, setEmail] = useState('')
    const [emailError, setEmailError] = useState('')
    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [repeatPasswordError, setRepeatPasswordError] = useState('')
    const [tac, setTAC] = useState(false)
    const [tacError, setTACError] = useState(false)
    const [pp, setPP] = useState(false)
    const [ppError, setPPError] = useState(false)
    const dispatch = useDispatch()

    const registerClick = () => {

    }

    return (
        <div>
            <Input label="Email" classes="email standard-input register-email" type="text" value={email} setter={setEmail} error={emailError} />
            <Input label="Username" classes="username standard-input register-username" type="text" value={repeatPassword} setter={setRepeatPassword} error={repeatPasswordError} />
            <Input label="Password" classes="password standard-input register-password" type="password" value={password} setter={setPassword} error={passwordError} />
            <Input label="Repeat Password" classes="repeat-password standard-input register-repeat-password" type="password" value={repeatPassword} setter={setRepeatPassword} error={repeatPasswordError} />
            <Input label="Terms and Conditions" classes="tac standard-input register-tac" type="checkbox" value={tac} setter={setTAC} error={tacError} />
            <Input label="Privacy Policy" classes="pp standard-input register-pp" type="checkbox" value={pp} setter={setPP} error={ppError} />
            <button onClick={registerClick}>Login</button>
        </div>
    )
}

export default RegisterWrapper