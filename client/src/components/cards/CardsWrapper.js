import { useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { getUserCards, responses } from '../../actions/cards/getCards-actions'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'

/**
 * Wrapper for user informations
 */
const UserCardsWrapper = (props) => {
    const [cards, setCards] = useState([])
    const [gettingCards, setGettingCards] = useState(false)
    const [gotCards, setGotCards] = useState(false)
    const [error, setError] = useState('')
    const [justEntered, setJustEntered] = useState(true)
    const dispatch = useDispatch()

    useSelector((state) => {
        if (checkIfEmptyObject(state.getCardsReducer) || state.getCardsReducer.response === responses.GETTING_CARDS) {
            return
        }

        switch (state.getCardsReducer.code) {
            case 400:
                if (error !== 'Bad data provided.') {
                    setError('Bad data provided.')
                }
                return
            case 401:
            case 404:
                let el = document.getElementById('link-to-click-on-bad')
                if (el && !justEntered) {
                    el.click()
                }
                return
            case 406:
                if (cards.length !== 0) {
                    setCards([])
                }
                return
            default:
                break
        }

        if (!gotCards) {
            setGotCards(true)
            let cards = []
            let cardsToFilter = state.getCardsReducer.cards
            for (let i = 0; i < cardsToFilter.length; i++) {
                cards.push(
                    <div key={cardsToFilter[i].card._id}>
                        {cardsToFilter[i].card.name} - {cardsToFilter[i].quantity}
                    </div>
                )
            }
            setCards(cards)
        }
    })

    let cardsContainer = undefined
    if (!props.verified) {
        cardsContainer = <p>Verifying if you are an user and admin.</p>
    } else if (!props.owner) {
        cardsContainer = <p>You are not verified as an owner of this account therefore you are not able to see this user cards.</p>
    } else if (props.owner && props.verified) {
        if (!gettingCards) {
            setGettingCards(true)
            dispatch(getUserCards(window.localStorage.getItem('id'), window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
            setJustEntered(false)
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
        getCardsReducer: state.getCardsReducer
    }
}

const mapDispatchToProps = { getUserCards }


export default connect(mapStateToProps, mapDispatchToProps)(UserCardsWrapper)