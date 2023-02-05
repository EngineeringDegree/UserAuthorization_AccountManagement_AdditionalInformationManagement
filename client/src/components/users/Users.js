import Banhammer from "./Banhammer"
import { Link } from 'react-router-dom'

/**
 * Prepares logic for displaying user.
 * @param {object} props 
 * @returns jsx for users with banhammer (or not)
 */
const Users = (props) => {

    /**
     * Formats users to readable data.
     * @returns jsx of users to display
     */
    const displayUsers = () => {
        let jsx = []
        for (let i = 0; i < props.users.length; i++) {
            const toProfile = "/users/" + props.users[i].id
            if (props.status === "USERS FOUND AND SHOW BANHAMMER") {
                jsx.push(
                    <div key={props.users[i].id}>
                        <Link to={toProfile} className="standard-link">
                            <div className="justify-content-between d-lg-flex">
                                <p className="orange-text align-self-center my-0">{props.users[i].username}</p>
                                <Banhammer id={props.users[i].id} banCertainUser={props.banCertainUser} />
                            </div>

                        </Link>
                    </div >
                )
            } else {
                jsx.push(
                    <div key={props.users[i].id}>
                        <Link to={toProfile} className="standard-link">
                            <div className="justify-content-between d-flex">
                                <p className="orange-text">{props.users[i].username}</p>
                            </div>
                        </Link>
                    </div >
                )
            }
        }

        return jsx
    }

    return (
        <div className="box-container users-container">
            {displayUsers()}
        </div>
    )
}

export default Users