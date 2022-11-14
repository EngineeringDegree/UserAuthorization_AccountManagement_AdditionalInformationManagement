import Input from '../common/Input'

/**
 * Wrapper for user informations
 */
const UserInfoWrapper = (props) => {
    let jsxToReturn = []
    if (props.owner) {
        jsxToReturn = [
            <Input label="Username" key="username" classes="username standard-input change-username" type="text" value={props.userInfoPack.username} setter={props.userInfoPack.setUsername} />,
            <Input label="Password" key="password" classes="password standard-input change-password" type="password" value={props.userInfoPack.password} setter={props.userInfoPack.setPassword} />,
            <Input label="Email" key="email" classes="email standard-input change-email" type="text" value={props.userInfoPack.email} setter={props.userInfoPack.setEmail} />,
            <button key="change-email" onClick={props.userInfoPack.askForNewEmail}>Change email</button>,
            <button key="new-password" onClick={props.userInfoPack.askForNewPassword}>Ask for new password</button>
        ]

        if (!props.admin) {
            jsxToReturn.push(<Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" disabled={true} checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfimed} />)
            jsxToReturn.push(<Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" disabled={true} checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />)
        } else {
            jsxToReturn.push(<Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfirmed} />)
            jsxToReturn.push(<Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />)
        }
    } else {
        jsxToReturn = [
            <Input label="Username" key="username" classes="username standard-input change-username" type="text" disabled={true} value={props.userInfoPack.username} setter={props.userInfoPack.setUsername} />,
            <Input label="Password" key="password" classes="password standard-input change-password" type="password" disabled={true} value={props.userInfoPack.password} setter={props.userInfoPack.setPassword} />,
            <Input label="Email" key="email" classes="email standard-input change-email" type="text" disabled={true} value={props.userInfoPack.email} setter={props.userInfoPack.setEmail} />
        ]

        if (!props.admin) {
            jsxToReturn.push(<Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" disabled={true} checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfimed} />)
            jsxToReturn.push(<Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" disabled={true} checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />)
        } else {
            jsxToReturn.push(<Input label="Confirmed" key="confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfirmed} />)
            jsxToReturn.push(<Input label="Admin" key="admin" classes="admin standard-input change-admin" type="checkbox" checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />)
        }
    }

    return (
        <div>
            User info
            {jsxToReturn}
        </div>
    )
}

export default UserInfoWrapper