const Pack = (props) => {
    return (
        <div className="shop-record m-4 text-center">
            <h2 className="title my-4 text-center">{props.name}</h2>

            <button onClick={() => {
                props.openPack(props.id)
            }} className="standard-btn">Open pack</button>

        </div>
    )
}

export default Pack