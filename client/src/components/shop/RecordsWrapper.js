import ShopRecord from "./ShopRecord"

const RecordsWrapper = (props) => {
    const getRecords = () => {
        let jsx = []

        for (let i = 0; i < props.packs.length; i++) {
            jsx.push(
                <ShopRecord key={props.packs[i]._id} pack={props.packs[i]} buyPack={props.buyPack} coins={props.coins} />
            )
        }

        return jsx
    }

    return (
        <div className="my-4 d-flex justify-content-around" style={{ flexWrap: "wrap" }}>
            {getRecords()}
        </div>
    )
}

export default RecordsWrapper