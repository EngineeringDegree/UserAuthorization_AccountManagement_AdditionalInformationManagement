import Card from "../cards/Card"

/**
 * Wraps all main screen elements.
 */
const MainWrapper = () => {

    return (
        <div className="text-center p-4">
            <h2 className="title mb-4">Welcome to Clash of Myhs!</h2>

            <p>It is a platform designed for playing card strategy game.</p>
            <p>You can as well collect cards, make best deck in the world or just govern your account.</p>
            <p className="mb-5">Here are some interesting cards:</p>
            <div className="d-lg-flex justify-content-around">
                <Card name={"Test"} type={"Cavalary"} description={"This is my test description for this funny card."} attack={5} mobility={5} vision={5} defense={1} image={"/img/card.jpg"} />
                <Card name={"Test2"} type={"Shielder"} description={"This is my test description for this funny card."} attack={5} mobility={5} vision={5} defense={1} image={"/img/card.jpg"} />
                <Card name={"Test3"} type={"Scout"} description={"This is my test description."} attack={2} mobility={7} vision={8} defense={1} image={"/img/card.jpg"} />
            </div>
        </div>
    )
}

export default MainWrapper