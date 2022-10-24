var deck, userCards
$(document).ready(init())

/**
 * Adds listeners
 */
function init() {
    const queryString = window.location.search
    const urlParams = new URLSearchParams(queryString)
    deck = { name: '', nation: '', nationName: '', cards: { cardsPrepared: [], cardsDisplayed: [] }, strength: 0, id: urlParams.get('deckId') }
    userCards = []
    if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
        $.ajax({
            type: "GET",
            url: `/get/user/deck?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}&id=${deck.id}`,
            success: function (res) {
                if (res.token) {
                    window.localStorage.setItem("token", res.token)
                }
                deck.name = res.deck.name
                deck.nation = res.deck.nation
                deck.nationName = res.nation
                deck.strength = res.deck.strength
                deck.cards.cardsPrepared = res.deck.cards
                sendRequest()
            },
            error: function (xhr, ajaxOptions, thrownError) {
                console.log(xhr.responseJSON)
                if (xhr.responseJSON.action == "LOGOUT") {
                    window.location.pathname = '/logout'
                    return
                }
            },
            dataType: "json",
            contentType: "application/json"
        })
    } else {
        window.location.pathname = '/logout'
    }

    /**
     * Sends request for user with current choosen parameters
     */
    function sendRequest() {
        if (window.localStorage.getItem('email') && window.localStorage.getItem('token') && window.localStorage.getItem('refreshToken')) {
            $.ajax({
                type: "GET",
                url: `/get/user/cards/info?email=${window.localStorage.getItem('email')}&token=${window.localStorage.getItem('token')}&refreshToken=${window.localStorage.getItem('refreshToken')}`,
                success: function (res) {
                    if (res.token) {
                        window.localStorage.setItem("token", res.token)
                    }

                    userCards = res.cards
                    $('#save-deck').on('click', saveNationDeck)
                    $('#name').on('keyup', editNameFront)

                    var cardsToDisplay = []
                    for (let i = 0; i < userCards.length; i++) {
                        if (userCards[i].card.nation[0] == 'All') {
                            cardsToDisplay.push({ card: userCards[i].card, quantity: userCards[i].quantity })
                            continue
                        }

                        for (let j = 0; j < userCards[i].card.nation.length; j++) {
                            if (userCards[i].card.nation[j] == deck.nation) {
                                cardsToDisplay.push({ card: userCards[i].card, quantity: userCards[i].quantity })
                                break
                            }
                        }
                    }

                    userCards = cardsToDisplay

                    for (let i = 0; i < userCards.length; i++) {
                        for (let j = 0; j < deck.cards.cardsPrepared.length; j++) {
                            if (deck.cards.cardsPrepared[j]._id == userCards[i].card._id) {
                                deck.cards.cardsDisplayed.push({
                                    _id: userCards[i].card._id,
                                    name: userCards[i].card.name,
                                    strength: userCards[i].card.attack + userCards[i].card.defense + userCards[i].card.effects.length + userCards[i].card.mobility + userCards[i].card.type.length,
                                    quantity: deck.cards.cardsPrepared[j].quantity
                                })
                            }
                        }
                    }
                    displayDeck(deck)
                    displayCards(userCards, deck.cards.cardsPrepared)
                },
                error: function (xhr, ajaxOptions, thrownError) {
                    if (xhr.responseJSON.action == "LOGOUT") {
                        window.location.pathname = '/logout'
                        return
                    }
                },
                dataType: "json",
                contentType: "application/json"
            })
        } else {
            window.location.pathname = '/logout'
        }
    }

    /**
     * Sends request to save current selected nation deck (add or overwrite old one)
     */
    function saveNationDeck() {
        if ($('#name').val().trim() == "") {
            alert('You must pass name of your deck')
            return
        }

        editDeck(deck)
    }

    /**
     * Displays cards with buttons to add to deck
     * @param {array} cards of objects which will be displayed and left to use by user
     * @param {array} cardsAlreadyDisplayed of objects which are displayed so I can set input quantity on right place
     */
    function displayCards(cards, cardsAlreadyDisplayed) {
        var el = document.getElementById('displaying-cards')
        if (el) {
            el.innerHTML = ''
            for (let i = 0; i < cards.length; i++) {
                var div = document.createElement('div')
                div.className = 'card'
                var divName = document.createElement('div')
                divName.id = `${cards[i].card._id}-name`
                divName.className = 'name'
                if (cards[i].card.readyToUse) {
                    divName.textContent = cards[i].card.name
                } else {
                    divName.textContent = cards[i].card.name + ' - Card temporary turned off. Please do not use it if you want to play with this deck. '
                }
                div.appendChild(divName)
                var inputQuantity = document.createElement('input')
                inputQuantity.className = 'quantity'
                inputQuantity.id = cards[i].card._id
                inputQuantity.value = 0
                for (let j = 0; j < cardsAlreadyDisplayed.length; j++) {
                    if (cardsAlreadyDisplayed[j]._id == cards[i].card._id) {
                        inputQuantity.value = cardsAlreadyDisplayed[j].quantity
                        break
                    }
                }
                inputQuantity.type = 'range'
                inputQuantity.min = 0
                inputQuantity.max = cards[i].quantity
                inputQuantity.step = 1
                inputQuantity.addEventListener('input', editCardsFront, false)
                inputQuantity.addEventListener('change', editCardsFront, false)
                div.appendChild(inputQuantity)
                var cardStrength = document.createElement('input')
                cardStrength.id = `${cards[i].card._id}-strength`
                cardStrength.className = 'card-strength'
                cardStrength.value = cards[i].card.attack + cards[i].card.defense + cards[i].card.effects.length + cards[i].card.mobility + cards[i].card.type.length
                cardStrength.type = 'hidden'
                div.appendChild(cardStrength)
                el.appendChild(div)
            }
        }
    }

    /**
     * Displays current deck state on the screen
     * @param {array} deck of objects which contains deck object which will be sent to backend on "save" button click
     */
    function displayDeck(deck) {
        $('#nation').text(`Nation ${deck.nationName}`)
        $('#name').val(deck.name)
        $('#strength').text(`Strength:  ${deck.strength}`)
        var el = document.getElementById('cards-inside')
        if (el) {
            el.innerHTML = ''
            for (let i = 0; i < deck.cards.cardsDisplayed.length; i++) {
                var div = document.createElement('div')
                div.className = 'card'
                var divName = document.createElement('div')
                divName.className = 'name'
                divName.textContent = deck.cards.cardsDisplayed[i].name
                div.appendChild(divName)
                var divStr = document.createElement('div')
                divStr.className = 'strength'
                divStr.textContent = deck.cards.cardsDisplayed[i].strength
                div.appendChild(divStr)
                var qtStr = document.createElement('div')
                qtStr.className = 'quantity'
                qtStr.textContent = deck.cards.cardsDisplayed[i].quantity
                div.appendChild(qtStr)
                el.appendChild(div)
            }
        }
    }

    /**
     * Changes current decks displayed on frontend
     * @param {DOM} e event emiiter
     */
    function editCardsFront(e) {
        var quantity = $(`#${e.target.id}`).val()
        var name = $(`#${e.target.id}-name`).text()
        var strength = $(`#${e.target.id}-strength`).val()
        var cardsPrepared = deck.cards.cardsPrepared
        var cardsDisplayed = deck.cards.cardsDisplayed
        var cardAlreadyInDeck = false
        var placeInCards = -1
        for (let i = 0; i < cardsPrepared.length; i++) {
            if (cardsPrepared[i]._id == e.target.id) {
                placeInCards = i
                cardsPrepared[i].quantity = quantity
                cardAlreadyInDeck = true
                break
            }
        }

        if (!cardAlreadyInDeck) {
            cardsPrepared.push({ _id: e.target.id, quantity: quantity })
            deck.cards.cardsPrepared = cardsPrepared
            cardsDisplayed.push({ _id: e.target.id, quantity: quantity, name: name, strength: strength })
            deck.cards.cardsDisplayed = cardsDisplayed
            var strengthSum = 0
            for (let i = 0; i < cardsDisplayed.length; i++) {
                strengthSum += cardsDisplayed[i].strength * cardsDisplayed[i].quantity
            }
            deck.strength = strengthSum
            displayDeck(deck)
            return
        }

        deck.cards.cardsPrepared = cardsPrepared
        cardsDisplayed[placeInCards].quantity = quantity
        deck.cards.cardsDisplayed = cardsDisplayed
        var strengthSum = 0
        for (let i = 0; i < cardsDisplayed.length; i++) {
            strengthSum += cardsDisplayed[i].strength * cardsDisplayed[i].quantity
        }
        deck.strength = strengthSum
        displayDeck(deck)
    }

    /**
     * Alters the deck name element
     */
    function editNameFront() {
        deck.name = $('#name').val()
    }
}
