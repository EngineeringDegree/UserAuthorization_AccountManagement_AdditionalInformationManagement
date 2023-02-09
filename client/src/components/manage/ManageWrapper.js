import Management from "../cards/Management"

/**
 * Logic for manage wrapper.
 * @returns jsx for manage wrapper (which is just redirections)
 */
const ManageWrapper = () => {
    return (
        <div className="manage wrapper">
            <h2 className="title my-4 text-center">Manage administrator elements</h2>
            <div className="boxes-wrapper mx-auto">
                <div className="justify-content-around d-lg-flex">
                    <Management name={"Card effects"} description={"Manage effects that card can place on allies or enemies."} to={"/manage/effects"} />
                    <Management name={"Card nations"} description={"Manage possible nations to choose in game."} to={"/manage/nations"} />
                    <Management name={"Card types"} description={"Manage types of cards avaiable in game."} to={"/manage/types"} />
                </div>
                <div className=" justify-content-between d-lg-flex">
                    <Management name={"Cards"} description={"Manage cards avaiable in game."} to={"/manage/cards"} />
                    {/* <Management name={"Maps "} description={"Manage maps for users to play on."} to={"/manage/maps"} /> */}
                    <Management name={"Shop packs"} description={"Manage packs avaiable in shop."} to={"/manage/packs"} />
                </div>
                {/* <div className=" justify-content-between d-lg-flex"> */}
                {/* <Management name={"Map fields"} description={"Manage fields from which map is created."} to={"/manage/fields"} /> */}
                {/* </div> */}
            </div>
        </div>
    )
}

export default ManageWrapper