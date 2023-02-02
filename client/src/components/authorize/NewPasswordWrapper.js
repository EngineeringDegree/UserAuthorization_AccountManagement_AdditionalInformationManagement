import { useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { setNewPassword, responses } from '../../actions/user/setNewPassword-actions'
import { notEmpty, equals } from "../../utils/signIn/inputChecks"
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"
import Input from "../common/Input"

/**
 * Wraps all new password elements.
 */
const NewPasswordWrapper = () => {
    const [searchParams] = useSearchParams()
    const [email] = useState(searchParams.get('email'))
    const [accessToken] = useState(searchParams.get('accessToken'))
    const [password, setPassword] = useState('')
    const [repeatPassword, setRepeatPassword] = useState('')
    const [passwordError, setPasswordError] = useState('')
    const [repeatPasswordError, setRepeatPasswordError] = useState('')
    const [reqeustSent, setRequestSent] = useState(false)
    const [error, setError] = useState('')
    const dispatch = useDispatch()

    const registerClick = () => {
        setError('')
        let err = false
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

        if (err) {
            return
        }

        dispatch(setNewPassword(email, accessToken, password, repeatPassword))
    }

    useSelector((state) => {
        if (state.setPassword.response === responses.CHANGING_PASSWORD || checkIfEmptyObject(state.setPassword)) {
            return
        }

        if (state.setPassword === 'Network Error') {
            if (error !== 'Network Error. Try again later.') {
                setError('Network Error. Try again later.')
            }
            return
        }

        switch (state.setPassword.code) {
            case 200:
                if (error !== 'Password changed succesfully!') {
                    setError('Password changed succesfully!')
                }
                return
            case 400:
                if (error !== 'Bad request') {
                    setError('Bad request')
                }
                return
            case 401:
                if (error !== 'Passwords do not match!') {
                    setError('Passwords do not match!')
                }
                return
            case 406:
                if (error !== 'User with that email already exists!') {
                    setError('User with that email already exists!')
                }
                return
            case 500:
                if (error !== 'Something went wrong. Try again later!') {
                    setError('Something went wrong. Try again later!')
                }
                return
            default:
                return
        }
    })

    return (
        <div className="text-center">
            <Input label="Password" classes="password standard-input register-password" type="password" value={password} setter={setPassword} error={passwordError} errorSetter={setPasswordError} />
            <Input label="Repeat Password" classes="repeat-password standard-input register-repeat-password" type="password" value={repeatPassword} setter={setRepeatPassword} error={repeatPasswordError} errorSetter={setRepeatPasswordError} />
            <button className="my-4 standard-btn" onClick={registerClick} disabled={reqeustSent}>Change Password</button>
            <p className="mx-auto my-4 orange-text">{error}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        state: state.setPassword
    }
}

const mapDispatchToProps = { setNewPassword }

export default connect(mapStateToProps, mapDispatchToProps)(NewPasswordWrapper)