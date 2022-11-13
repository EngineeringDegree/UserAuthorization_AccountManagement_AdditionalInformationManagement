import { useState } from "react"
import { useParams } from 'react-router-dom'
import Input from '../common/Input'

/**
 * Wrapper for user informations
 */
const UserInfoWrapper = (props) => {
    console.log(props.userInfoPack)

    return (
        <div>
            User info
            <Input label="Username" classes="username standard-input change-username" type="text" value={props.userInfoPack.username} setter={props.userInfoPack.setUsername} />
            <Input label="Password" classes="password standard-input change-password" type="password" value={props.userInfoPack.password} setter={props.userInfoPack.setPassword} />
            <Input label="Email" classes="email standard-input change-email" type="text" value={props.userInfoPack.email} setter={props.userInfoPack.setEmail} />
            <Input label="Confirmed" classes="confirmed standard-input change-confirmed" type="checkbox" checked={props.userInfoPack.confirmed} setter={props.userInfoPack.setConfimed} />
            <Input label="Admin" classes="admin standard-input change-admin" type="checkbox" checked={props.userInfoPack.userAdmin} setter={props.userInfoPack.setUserAdmin} />
        </div>
    )
}

export default UserInfoWrapper