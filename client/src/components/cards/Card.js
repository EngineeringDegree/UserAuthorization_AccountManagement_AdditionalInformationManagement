import { Shield, Visibility, Colorize, DirectionsRun, Filter1 } from "@mui/icons-material"

/**
 * Prepares jsx for a card to display.
 * @param {object} props 
 * @returns JSX of a card.
 */
const Card = (props) => {

    return (
        <div className="card mx-auto mb-4">
            <img src={props.image} className="card-img-top" alt="card" />
            <div className="card-body d-flex flex-column">
                <div className="d-flex justify-content-between">
                    <h5 className="card-title">{props.name}</h5>
                    <h5 className="card-title">{props.type}</h5>
                </div>
                <p className="card-text">{props.description}</p>
                <div className="d-flex justify-content-between mt-auto">
                    <div>
                        <Colorize />
                        <p className="card-attr">{props.attack}</p>
                    </div>
                    <div>
                        <DirectionsRun />
                        <p className="card-attr">{props.mobility}</p>
                    </div>
                    <div>
                        <Visibility />
                        <p className="card-attr">{props.vision}</p>
                    </div>
                    <div>
                        <Shield />
                        <p className="card-attr">{props.defense}</p>
                    </div>
                    {(props.quantity) ?
                        <div>
                            <Filter1 />
                            <p className="card-attr">{props.quantity}</p>
                        </div>
                        :
                        <></>}
                </div>
            </div>
        </div>
    )
}

export default Card