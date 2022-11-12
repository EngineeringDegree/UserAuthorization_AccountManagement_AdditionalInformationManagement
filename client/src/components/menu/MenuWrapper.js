import { Link } from "react-router-dom"
import { useSelector, useDispatch, connect } from 'react-redux'
import { userLoggedIn } from '../../actions/user/userLoggedIn-actions'
import { checkIfEmptyObject } from "../../utils/object/checkIfObject"

/**
 * MenuWrapper object to display
 * @param {object} props 
 * @returns jsx of the menu wrapper
 */
const MenuWrapper = (props) => {
    const userLogged = useSelector((state) => state.userLoggedIn)
    const dispatch = useDispatch()

    if (checkIfEmptyObject(userLogged)) {
        dispatch(userLoggedIn(window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
    }

    let menuFilter = props.menuElements
    if (!props.isServerUp) {
        menuFilter = menuFilter.filter((e) => {
            return (!e.admin && !e.loggedIn)
        })

    }

    const menuElements = []
    for (let i = 0; i < menuFilter.length; i++) {
        menuElements.push(<Link to={menuFilter[i].address} key={menuFilter[i].name}>{menuFilter[i].name}</Link>)
    }

    return (
        <div className="d-flex">
            {menuElements}
        </div>
    )
}

function mapStateToProps(state) {
    return {
        userLoggedIn: state.userLoggedIn
    }
}

const mapDispatchToProps = { userLoggedIn }

export default connect(mapStateToProps, mapDispatchToProps)(MenuWrapper)