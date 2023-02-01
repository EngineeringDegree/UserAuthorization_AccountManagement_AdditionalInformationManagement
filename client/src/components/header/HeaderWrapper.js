import React, { useState } from "react"
import { Link } from "react-router-dom"
import MenuWrapper from "../menu/MenuWrapper"
import Logo from "../header/Logo"
import Hamburger from 'hamburger-react'

/**
 * HeaderWrapper object to display
 * @param {object} props 
 * @returns jsx of the header wrapper
 */
const HeaderWrapper = (props) => {
    const [collapsed, setCollapsed] = useState(false)

    /**
     * Sets class for menu wrapper div.
     * @returns string of class.
     */
    const setClassName = () => {
        if (collapsed) {
            return "navbar-collapse justify-content-end bg-light"
        } else {
            return "collapse navbar-collapse justify-content-end"
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between py-4 main-nav">
            <Link to={"/"} className={"navbar-brand px-4"}>
                <Logo />
            </Link>

            <div className="mx-4">
                <Hamburger toggled={collapsed} toggle={setCollapsed} size={30} />
            </div>

            <div className={setClassName()} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto px-4">
                    <MenuWrapper menuElements={props.menuElements} />
                </ul>
            </div>
        </nav>
    )
}

export default HeaderWrapper