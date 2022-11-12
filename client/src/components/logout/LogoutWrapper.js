/**
 * LogoutWrapper object to display
 * @param {object} props 
 * @returns jsx of the logout wrapper
 */
const LogoutWrapper = (props) => {
    if (window.localStorage.getItem('email') || window.localStorage.getItem('token') || window.localStorage.getItem('refreshToken')) {
        window.localStorage.clear()
        props.authStateSetter({
            email: null,
            token: null,
            refreshToken: null
        })
    }

    return (
        <div>
            Logout
        </div>
    )
}

export default LogoutWrapper