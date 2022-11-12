/**
 * LogoutWrapper object to display
 * @returns jsx of the logout wrapper
 */
const LogoutWrapper = () => {
    if (window.localStorage.getItem('email') || window.localStorage.getItem('token') || window.localStorage.getItem('refreshToken')) {
        window.localStorage.clear()
    }

    return (
        <div>
            Logout
        </div>
    )
}

export default LogoutWrapper