import { useState } from "react"
import { useParams } from 'react-router-dom'

/**
 * Wrapper for user profile
 */
const UserProfileWrapper = () => {
    const params = useParams()
    const [id] = useState(params.id)

    return (
        <div>
            User profile wrapper for user {id}
        </div>
    )
}

export default UserProfileWrapper