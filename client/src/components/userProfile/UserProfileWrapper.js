import { useState } from "react"
import { useParams } from 'react-router-dom'
import UserInfoWrapper from "./UserInfoWrapper"
import UserCardsWrapper from "./UserCardsWrapper"

/**
 * Wrapper for user profile
 */
const UserProfileWrapper = () => {
    const params = useParams()
    const [id] = useState(params.id)
    const [owner, setOwner] = useState(false)
    const [verified, setVerified] = useState(false)
    const [admin, setAdmin] = useState(false)

    return (
        <div>
            User profile wrapper for user {id}
            <UserInfoWrapper owner={owner} admin={admin} verified={verified} />
            <UserCardsWrapper owner={owner} verified={verified} />
        </div>
    )
}

export default UserProfileWrapper