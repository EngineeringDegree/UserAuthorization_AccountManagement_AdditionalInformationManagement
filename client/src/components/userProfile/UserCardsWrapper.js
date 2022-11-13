import { useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'

/**
 * Wrapper for user informations
 */
const UserCardsWrapper = (props) => {
    const [cards, setCards] = useState([])
    const [gettingCards, setGettingCards] = useState(false)
    const [gotCards, setGotCards] = useState(false)
    const dispatch = useDispatch()

    useSelector((state) => {
        // console.log(state)
    })

    let cardsContainer = undefined
    if (!props.verified) {
        cardsContainer = <p>Verifying if you are an user and admin.</p>
    } else if (!props.owner) {
        cardsContainer = <p>You are not verified as an owner of this account therefore you are not able to see this user cards.</p>
    } else if (props.owner && props.verified) {
        if (!gettingCards) {
            setGettingCards(true)
            // get cards
        }
    }

    return (
        <div>
            User cards
            {cardsContainer}
            {(cards.length === 0) ? ((gotCards) ? `No cards found` : `Getting cards`) : cards}
        </div>
    )
}

const mapStateToProps = (state) => {
    return {

    }
}

const mapDispatchToProps = {}


export default connect(mapStateToProps, mapDispatchToProps)(UserCardsWrapper)