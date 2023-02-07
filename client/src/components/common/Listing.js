import { Link } from "react-router-dom"

const Lisiting = (props) => {
    const display = () => {
        let jsx = []
        for (let i = 0; i < props.list.length; i++) {
            const to = "/manage/"+ props.name + "/edit/" + props.list[i]._id
            jsx.push(
                <div key={props.list[i]._id}>
                    <Link to={to} className="standard-link">
                        <div className="justify-content-between d-flex">
                            <p className="orange-text">{props.list[i].name}</p>
                        </div>
                    </Link>
                </div >
            )
        }

        return jsx
    }

    return (
        <div className="box-container">
            {display()}
        </div>
    )
}

export default Lisiting