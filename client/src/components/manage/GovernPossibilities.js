import Management from "../cards/Management"
import { Link } from "react-router-dom"

/**
 * Logic for govern possibilities.
 * @param {object} props 
 * @returns jsx for govern possibilities.
 */
const GovernPossibilities = (props) => {

    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">{props.pageName}</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="text-center">
                    <Link to={"/manage"} className={"standard-link"}>
                        <button className="standard-btn">
                            Back
                        </button>
                    </Link>
                </div>
                <div className="justify-content-around d-lg-flex">
                    <Management name={props.nameAdd} description={props.descriptionAdd} to={props.toAdd} />
                    <Management name={props.nameEdit} description={props.descriptionEdit} to={props.toEdit} />
                </div>
            </div>
        </div>
    )
}

export default GovernPossibilities