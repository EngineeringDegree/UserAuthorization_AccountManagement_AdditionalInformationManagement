import { Link } from "react-router-dom"

const Management = (props) => {

    return (
        <div className="card mx-auto mb-4 p-3 d-flex flex-column">
            <h5 className="card-title text-center">{props.name}</h5>
            <p className="orange-text text-center">{props.description}</p>
            <p className="text-center">
                <Link to={props.to} className={"standard-link"}>
                    <button className="standard-btn">
                        Manage
                    </button>
                </Link>
            </p>
        </div>
    )
}

export default Management