import { useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { useSearchParams } from 'react-router-dom'
import { authorize, responses } from '../../actions/user/userAuthorize-actions'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

/**
 * Wraps all authorize account elements.
 */
const AuthorizeWrapper = () => {
    const [searchParams] = useSearchParams()
    const [email] = useState(searchParams.get('email'))
    const [accessToken] = useState(searchParams.get('accessToken'))
    const [text, setText] = useState('Authorizing...')
    const [authorizing, setAuthorizing] = useState(false)
    const dispatch = useDispatch()

    useSelector((state) => {
        if (checkIfEmptyObject(state.authReducer) || state.authReducer.response === responses.AUTHORIZING) {
            if (!authorizing) {
                setAuthorizing(true)
                dispatch(authorize(email, accessToken))
            }
            return
        }

        switch (state.authReducer.code) {
            case 200:
                if (text !== "Authorized") {
                    setText("Authorized")
                }
                return
            case 400:
                if (text !== "Bad request. No email or accessToken specified.") {
                    setText("Bad request. No email or accessToken specified.")
                }
                return
            case 401:
                if (text !== "Bad access token.") {
                    setText("Bad access token.")
                }
                return
            case 404:
                if (text !== "User not found.") {
                    setText("User not found.")
                }
                return
            case 406:
                if (text !== "User account was already confirmed.") {
                    setText("User account was already confirmed.")
                }
                return
            case 500:
                if (text !== "Something went wrong. Try again later.") {
                    setText("Something went wrong. Try again later.")
                }
                return
            default:
                return
        }
    })

    return (
        <div className="text-center">
            <h2 className="title my-4 text-center">Authorization status</h2>
            <p className="mx-auto orange-text">{text}</p>
        </div>
    )
}

const mapStateToProps = (state) => {
    return {
        authReducer: state.authReducer
    }
}

const mapDispatchToProps = { authorize }

export default connect(mapStateToProps, mapDispatchToProps)(AuthorizeWrapper)