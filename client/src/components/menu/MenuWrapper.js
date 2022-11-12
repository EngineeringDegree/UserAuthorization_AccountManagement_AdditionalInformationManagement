import { Link } from "react-router-dom"

/**
 * MenuWrapper object to display
 * @param {object} props 
 * @returns jsx of the menu wrapper
 */
const MenuWrapper = (props) => {
    const menuElements = []
    for (let i = 0; i < props.menuElements.length; i++) {
        menuElements.push(<Link to={props.menuElements[i].address} key={props.menuElements[i].name}>{props.menuElements[i].name}</Link>)
    }

    return (
        <div className="d-flex">
            {menuElements}
        </div>
    )
}

export default MenuWrapper