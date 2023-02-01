import React, { useRef } from "react"
import LoginWrapper from "./LoginWrapper"
import RegisterWrapper from "./RegisterWrapper"
import { Link } from "react-router-dom"

/**
 * SignInWrapper object to display
 * @returns jsx of the SignIn wrapper
 */
const SignInWrapper = () => {
    const linkRef = useRef()

    return (
        <div>
            <Link ref={linkRef} to="/" className="hidden" id="link-to-click-on-succes"></Link>
            <div className="d-flex my-4 justify-content-around">
                <LoginWrapper successLink={linkRef} />
                <RegisterWrapper successLink={linkRef} />
            </div>
        </div>
    )
}

export default SignInWrapper