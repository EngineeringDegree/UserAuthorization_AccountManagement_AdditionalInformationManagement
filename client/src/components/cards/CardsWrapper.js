import { useState } from "react"
import { useDispatch, useSelector, connect } from 'react-redux'
import { getUserCards, responses } from '../../actions/cards/getCards-actions'
import { checkIfEmptyObject } from '../../utils/object/checkIfObject'
import Card from "./Card"

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
                if (!gotCards) {
                    setGotCards(true)
                }
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
            if (!state.getCardsReducer.cards) {
                return
            }
            let cardsToFilter = state.getCardsReducer.cards
            for (let i = 0; i < cardsToFilter.length; i++) {
                cards.push(
                    <Card key={cardsToFilter[i].card._id} image={cardsToFilter[i].card.image} quantity={cardsToFilter[i].quantity} name={cardsToFilter[i].card.name} description={cardsToFilter[i].card.description} attack={cardsToFilter[i].card.attack} mobility={cardsToFilter[i].card.mobility} vision={cardsToFilter[i].card.vision} defense={cardsToFilter[i].card.defense} />
                )
            }
            setCards(cards)
        }
    })

    if (!gettingCards) {
        setGettingCards(true)
        dispatch(getUserCards(window.localStorage.getItem('id'), window.localStorage.getItem('email'), window.localStorage.getItem('token'), window.localStorage.getItem('refreshToken')))
        setJustEntered(false)
    }

    return (
        <div className="text-center">
            <h2 className="title my-4 text-center">User cards</h2>
            <div className="d-flex justify-content-between flex-wrap">
                {(cards.length === 0) ?
                    ((gotCards) ?
                        <p className="mx-auto orange-text">No cards found</p>
                        :
                        <p className="mx-auto orange-text">Getting cards</p>
                    )
                    :
                    cards}
            </div>
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