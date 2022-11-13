import LoginWrapper from "./LoginWrapper"
import RegisterWrapper from "./RegisterWrapper"
import { Link } from "react-router-dom"

/**
 * SignInWrapper object to display
 * @returns jsx of the SignIn wrapper
 */
const SignInWrapper = () => {

    return (
        <div>
            <Link to="/" className="hidden" id="link-to-click-on-succes"></Link>
            <LoginWrapper />
            <RegisterWrapper />
        </div>
    )
}

export default SignInWrapper