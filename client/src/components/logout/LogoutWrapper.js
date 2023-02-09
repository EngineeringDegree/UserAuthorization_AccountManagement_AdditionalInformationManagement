import { Link } from "react-router-dom"

/**
 * LogoutWrapper object to display
 * @returns jsx of the logout wrapper
 */
const LogoutWrapper = () => {

    /**
     * Logs out user from frontend layer.
     */
    const logout = () => {
        if (window.localStorage.getItem('email') || window.localStorage.getItem('token') || window.localStorage.getItem('refreshToken')) {
            window.localStorage.clear()
        }
    }

    return (
        <div className="text-center p-4">
            <h2 className="title mb-4">Logout</h2>
            <p>You have been log out succesfully.</p>
            <p>You can now visit <a href="/" className={"standard-link"}>homepage</a> or <a href="/sign-in" className={"standard-link"}>login back</a> to your account.</p>
            {logout()}
        </div>
    )
}

export default LogoutWrapper