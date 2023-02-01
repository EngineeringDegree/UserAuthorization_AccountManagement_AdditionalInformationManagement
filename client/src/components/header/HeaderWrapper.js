import React, { useState } from "react"
import "material-icons/iconfont/material-icons.css"
import { Link } from "react-router-dom"
import MenuWrapper from "../menu/MenuWrapper"
import Logo from "../header/Logo"

/**
 * HeaderWrapper object to display
 * @param {object} props 
 * @returns jsx of the header wrapper
 */
const HeaderWrapper = (props) => {
    const [collapsed, setCollapsed] = useState(true)

    const setClassName = () => {
        if (collapsed) {
            return "collapse navbar-collapse justify-content-end"
        } else {
            return "navbar-collapse justify-content-end bg-light"
        }
    }

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light justify-content-between py-4 main-nav">
            <Link to={"/"} className={"navbar-brand px-4"}>
                <Logo />
            </Link>

            <button onClick={() => setCollapsed(!collapsed)} className="navbar-toggler mx-4" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                {(collapsed) ?
                    <span className="material-icons">
                        menu
                    </span>
                    :
                    <span className="material-icons">
                        close
                    </span>
                }
            </button>

            <div className={setClassName()} id="navbarSupportedContent">
                <ul className="navbar-nav mr-auto px-4">
                    <MenuWrapper menuElements={props.menuElements} />
                </ul>
            </div>
        </nav>
    )
}

export default HeaderWrapper