import MenuWrapper from "../menu/MenuWrapper"
import Logo from "./Logo"

/**
 * HeaderWrapper object to display
 * @param {object} props 
 * @returns jsx of the header wrapper
 */
const HeaderWrapper = (props) => {
    return (
        <div className="d-flex justify-space-between">
            <Logo />
            <MenuWrapper menuElements={props.menuElements} isServerUp={props.isServerUp} />
        </div>
    )
}

export default HeaderWrapper