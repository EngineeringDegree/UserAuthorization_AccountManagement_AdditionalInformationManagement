const ShopRecord = (props) => {
    return (
        <div className="shop-record m-4">
            <h2 className="title my-4 text-center">{props.pack.name}</h2>
            <p className="orange-text text-center">Price: {props.pack.price}</p>
            <p className="orange-text text-center">Cards inside: {props.pack.cardsCount}</p>

            <button onClick={() => {
                props.buyPack(props.pack._id, props.pack.price)
            }} disabled={(props.pack.price > props.coins)} className="standard-btn">Buy pack</button>

        </div>
    )
}

export default ShopRecord