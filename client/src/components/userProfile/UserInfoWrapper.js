import Input from '../common/Input'

/**
 * Wrapper for user informations
 */
const UserInfoWrapper = (props) => {
    let jsxToReturn = []
    if (props.owner) {
        jsxToReturn = [
            <div className='text-center'>
                <Input label="Username" key="username" classes="username standard-input change-username" type="text" value={props.userInfoPack.username} setter={props.userInfoPack.setUsername} error={props.userInfoPack.currentUsernameError} errorSetter={props.userInfoPack.setCurrentUsernameError} />
                <Input label="Password" key="password" classes="password standard-input change-password" type="password" value={props.userInfoPack.password} setter={props.userInfoPack.setPassword} error={props.userInfoPack.currentPasswordError} errorSetter={props.userInfoPack.setCurrentPasswordError} />
                <Input label="Email" key="email" classes="email standard-input change-email" type="text" value={props.userInfoPack.email} setter={props.userInfoPack.setEmail} error={props.userInfoPack.currentEmailError} errorSetter={props.userInfoPack.setCurrentEmailError} />
                <div className='text-center'>
                    <button key="change-email" className="my-4 standard-btn" onClick={props.userInfoPack.askForNewEmail}>Change email</button>
                </div>
                <div className='text-center'>
                    <button key="new-password" className="standard-btn" onClick={props.userInfoPack.askForNewPassword}>Ask for new password</button>
                </div>
            </div>
        ]

        if (!props.admin) {

            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" disabled={true} checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfimed} />
                </div>
            )
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" disabled={true} checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />
                </div>
            )
        } else {

            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfirmed} />
                </div>
            )
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />
                </div>
            )
        }
    } else {
        jsxToReturn = [
            <div className='text-center'>
                <Input label="Username" key="username" classes="username standard-input change-username" type="text" disabled={true} value={props.userInfoPack.username} setter={props.userInfoPack.setUsername} />
            </div>
        ]

        if (!props.admin) {
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" disabled={true} checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfimed} />
                </div>
            )
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" disabled={true} checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />
                </div>
            )
        } else {
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfirmed} />
                </div>
            )
            jsxToReturn.push(
                <div className='text-center'>
                    <Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />
                </div>
            )
        }
    }

    return (
        <div>
            <h2 className="title my-4 text-center">Account details</h2>
            {jsxToReturn}
        </div>
    )
}

export default UserInfoWrapper