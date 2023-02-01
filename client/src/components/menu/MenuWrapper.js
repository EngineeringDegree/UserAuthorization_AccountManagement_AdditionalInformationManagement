import { Link } from "react-router-dom"

/**
 * MenuWrapper object to display
 * @param {object} props 
 * @returns jsx of the menu wrapper
 */
const MenuWrapper = (props) => {

    /**
     * Creates menu elements to display.
     * @returns Menu elements jsx.
     */
    const createMenuElements = () => {
        let menuElements = []

        for (let i = 0; i < props.menuElements.length; i++) {
            if (props.menuElements[i].name === 'My Profile' && window.localStorage.getItem('id')) {
                menuElements.push(
                    <li className="nav-link menu-element standard-link" key={props.menuElements[i].name}>
                        <Link to={props.menuElements[i].address + '/' + window.localStorage.getItem('id')}>{props.menuElements[i].name}</Link>
                    </li>
                )
                continue
            }

            menuElements.push(
                <li className="nav-link menu-element standard-link" key={props.menuElements[i].name}>
                    <Link to={props.menuElements[i].address}>{props.menuElements[i].name}</Link>
                </li>
            )
        }

        return menuElements
    }

    return createMenuElements()
}

export default MenuWrapper