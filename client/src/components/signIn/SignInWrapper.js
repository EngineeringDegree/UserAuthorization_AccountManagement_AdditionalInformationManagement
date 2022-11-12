import LoginWrapper from "./LoginWrapper"
import RegisterWrapper from "./RegisterWrapper"

/**
 * SignInWrapper object to display
 * @returns jsx of the SignIn wrapper
 */
const SignInWrapper = () => {

    return (
        <div>
            <LoginWrapper />
            <RegisterWrapper />
        </div>
    )
}

export default SignInWrapper