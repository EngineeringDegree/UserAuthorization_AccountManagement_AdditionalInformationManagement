import { Link } from "react-router-dom"
import { useSelector, useDispatch } from 'react-redux'

/**
 * MenuWrapper object to display
 * @param {object} props 
 * @returns jsx of the menu wrapper
 */
const MenuWrapper = (props) => {
    const userLoggedIn = useSelector((state) => state.userLoggedIn)
    const dispatch = useDispatch()

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

export default MenuWrapper