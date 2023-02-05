import Management from "../cards/Management"
import { Link } from "react-router-dom"

const ManageDeckWrapper = () => {

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Manage decks</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center my-4">
                    <Link to={"/"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>
                <div className="justify-content-around d-lg-flex">
                    <Management name={"Create deck"} description={"Create new deck."} to={"/decks/add"} />
                    <Management name={"Edit deck"} description={"Edit existing deck."} to={"/decks/edit"} />
                </div>
            </div>
        </div>
    )
}

export default ManageDeckWrapper