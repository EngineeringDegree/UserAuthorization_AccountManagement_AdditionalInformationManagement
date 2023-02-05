import React, { Component } from 'react'
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import socketIOClient from 'socket.io-client'
import HeaderWrapper from './header/HeaderWrapper'
import MainWrapper from './main/MainWrapper'
import UserProfileWrapper from './userProfile/UserProfileWrapper'
import SignInWrapper from './signIn/SignInWrapper'
import NewPasswordWrapper from './authorize/NewPasswordWrapper'
import LogoutWrapper from './logout/LogoutWrapper'
import FooterWrapper from './footer/FooterWrapper'
import AllUsersWrapper from './users/AllUsersWrapper'
import { time } from '../utils/enum/time'
import { menuElements } from '../utils/menu/menuElements'
import { connect } from 'react-redux'
import { checkUserLoggedIn, responses } from '../actions/user/userLoggedIn-actions'
import AuthorizeWrapper from './authorize/AuthorizeWrapper'
import ManageWrapper from './manage/ManageWrapper'
import GovernPossibilities from './manage/GovernPossibilities'
import AddEffectsWrapper from './cards/AddEffectsWrapper'
import EditEffectsWrapper from './cards/EditEffectsWrapper'
import ListEffectsWrapper from './cards/ListEffectsWrapper'
import AddNationsWrapper from './cards/AddNationsWrapper'
import EditNationsWrapper from './cards/EditNationsWrapper'
import ListNationsWrapper from './cards/ListNationsWrapper'
import AddCardsWrapper from './cards/AddCardsWrapper'
import EditCardsWrapper from './cards/EditCardsWrapper'
import ListCardsWrapper from './cards/ListCardsWrapper'
import AddTypesWrapper from './cards/AddTypesWrapper'
import EditTypesWrapper from './cards/EditTypesWrapper'
import ListTypesWrapper from './cards/ListTypesWrapper'
import AddPacksWrapper from './packs/AddPacksWrapper'
import EditPacksWrapper from './packs/EditPacksWrapper'
import ListPacksWrapper from './packs/ListPacksWrapper'
import AddMapsWrapper from './maps/AddMapsWrapper'
import EditMapsWrapper from './maps/EditMapsWrapper'
import ListMapsWrapper from './maps/ListMapsWrapper'
import AddFieldsWrapper from './maps/AddFieldsWrapper'
import EditFieldsWrapper from './maps/EditFieldsWrapper'
import ListFieldsWrapper from './maps/ListFieldsWrapper'
import ShopWrapper from './shop/ShopWrapper'
import PacksWrapper from './packs/PacksWrapper'
import ManageDeckWrapper from './deck/ManageDeckWrapper'
import AddDeckWrapper from './deck/AddDeckWrapper'
import EditDeckWrapper from './deck/EditDeckWrapper'
import ListDeckWrapper from './deck/ListDeckWrapper'

/**
 * Returns switch with whole app. Entrance point.
 */
class App extends Component {
  /**
   * When components mounts tree.
   * @param {object} props passed from parent. 
   */
  constructor(props) {
    super(props)
    this.state = {
      socket: socketIOClient(process.env.REACT_APP_GAME_API, { 'transports': ['websocket'], 'force new connection': true }),
      lastSocketState: false,
      tries: 0,
      email: window.localStorage.getItem('email'),
      token: window.localStorage.getItem('token'),
      refreshToken: window.localStorage.getItem('refreshToken')
    }

    setInterval(this.checkSocketState.bind(this), time.MILISECCOND_50)
  }

  /**
   * When component firstly render.
   */
  componentDidMount() {
    this.props.checkUserLoggedIn(this.state.email, this.state.token, this.state.refreshToken)
  }

  /**
   * Check socket state every second. 
   */
  checkSocketState() {
    if (!this.state.lastSocketState && this.state.tries < 2) {
      this.setState({
        tries: this.state.tries + 1
      })
    }

    if (this.state.socket.connected !== this.state.lastSocketState) {
      const tries = (this.state.socket.connected ? 0 : this.state.tries)

      this.setState({
        lastSocketState: this.state.socket.connected,
        tries: tries
      })
    }

    if (this.state.email !== window.localStorage.getItem('email') || this.state.token !== window.localStorage.getItem('token') || this.state.refreshToken !== window.localStorage.getItem('refreshToken')) {
      this.setState({
        email: window.localStorage.getItem('email'),
        token: window.localStorage.getItem('token'),
        refreshToken: window.localStorage.getItem('refreshToken')
      })
    }
  }

  /**
   * Based on response from server displays elements.
   * @param {object} that pointer to parent class (App).
   * @returns array of menu elements to display.
   */
  filterMenuElements(that) {
    let menuToReturn = menuElements
    if (that.props.userLoggedIn.response === responses.REQUESTING_ACCOUNT_AUTHORIZATION || that.props.userLoggedIn.response === responses.NO_TOKENS_EMAIL || that.props.userLoggedIn.status === responses.USER_NOT_AUTHORIZED || !that.state.socket.connected) {
      menuToReturn = menuToReturn.filter((e) => {
        return !e.loggedIn || e.alwaysVisible
      })

      return menuToReturn
    }

    if (that.props.userLoggedIn.admin) {
      menuToReturn = menuToReturn.filter((e) => {
        return e.loggedIn || e.alwaysVisible
      })
      return menuToReturn
    }

    if (window.localStorage.getItem('email') == null || window.localStorage.getItem('token') == null || window.localStorage.getItem('refreshToken') == null) {
      menuToReturn = menuToReturn.filter((e) => {
        return !e.loggedIn || e.alwaysVisible
      })

      return menuToReturn
    }

    if (that.props.userLoggedIn.token && that.props.userLoggedIn.token !== window.localStorage.getItem('token')) {
      that.setState({
        token: window.localStorage.getItem('token')
      })
    }


    menuToReturn = menuToReturn.filter((e) => {
      return (!e.admin && e.loggedIn) || e.alwaysVisible
    })

    return menuToReturn
  }

  render() {
    const menuToDisplay = this.filterMenuElements(this)

    return (
      <Router>
        <HeaderWrapper menuElements={menuToDisplay} />
        <Routes>
          <Route path='/' element={<MainWrapper />} />
          <Route path='/changePassword' element={<NewPasswordWrapper />} />
          <Route path='/users' element={<AllUsersWrapper />} />
          <Route path='/users/:id' element={<UserProfileWrapper />} />
          <Route path='/manage' element={<ManageWrapper />} />
          <Route path='/manage/effects' element={
            <GovernPossibilities
              pageName={"Effects"}
              nameAdd={"Add new effect"}
              descriptionAdd={"Add new effect to use it in card."}
              toAdd={"/manage/effects/add"}
              nameEdit={"Edit effect"}
              descriptionEdit={"Edit existing effect."}
              toEdit={"/manage/effects/edit"}
            />
          } />
          <Route path='/manage/nations' element={
            <GovernPossibilities
              pageName={"Nations"}
              nameAdd={"Add new nation"}
              descriptionAdd={"Add new nation to use it in card."}
              toAdd={"/manage/nations/add"}
              nameEdit={"Edit nation"}
              descriptionEdit={"Edit existing nation."}
              toEdit={"/manage/nations/edit"}
            />
          } />
          <Route path='/manage/types' element={
            <GovernPossibilities
              pageName={"Types"}
              nameAdd={"Add new type"}
              descriptionAdd={"Add new type to use it in card."}
              toAdd={"/manage/types/add"}
              nameEdit={"Edit type"}
              descriptionEdit={"Edit existing type."}
              toEdit={"/manage/types/edit"}
            />
          } />
          <Route path='/manage/cards' element={
            <GovernPossibilities
              pageName={"Cards"}
              nameAdd={"Add new card"}
              descriptionAdd={"Add new card."}
              toAdd={"/manage/cards/add"}
              nameEdit={"Edit card"}
              descriptionEdit={"Edit existing card."}
              toEdit={"/manage/cards/edit"}
            />
          } />
          <Route path='/manage/maps' element={
            <GovernPossibilities
              pageName={"Maps"}
              nameAdd={"Add new map"}
              descriptionAdd={"Add new map."}
              toAdd={"/manage/maps/add"}
              nameEdit={"Edit map"}
              descriptionEdit={"Edit existing map."}
              toEdit={"/manage/maps/edit"}
            />
          } />
          <Route path='/manage/packs' element={
            <GovernPossibilities
              pageName={"Shop Packs"}
              nameAdd={"Add new shop pack"}
              descriptionAdd={"Add new shop pack to let user buy it in shop."}
              toAdd={"/manage/shopPacks/add"}
              nameEdit={"Edit shop pack"}
              descriptionEdit={"Edit existing shop pack."}
              toEdit={"/manage/effshopPacksects/edit"}
            />
          } />
          <Route path='/manage/fields' element={
            <GovernPossibilities
              pageName={"Fields"}
              nameAdd={"Add new field"}
              descriptionAdd={"Add new field to use it in map."}
              toAdd={"/manage/fields/add"}
              nameEdit={"Edit field"}
              descriptionEdit={"Edit existing field."}
              toEdit={"/manage/fields/edit"}
            />
          } />
          <Route path='/manage/effects/add' element={<AddEffectsWrapper />} />
          <Route path='/manage/effects/edit' element={<ListEffectsWrapper />} />
          <Route path='/manage/effects/edit/:id' element={<EditEffectsWrapper />} />
          <Route path='/manage/nations/add' element={<AddNationsWrapper />} />
          <Route path='/manage/nations/edit' element={<ListNationsWrapper />} />
          <Route path='/manage/nations/edit/:id' element={<EditNationsWrapper />} />
          <Route path='/manage/types/add' element={<AddTypesWrapper />} />
          <Route path='/manage/types/edit' element={<ListTypesWrapper />} />
          <Route path='/manage/types/edit/:id' element={<EditTypesWrapper />} />
          <Route path='/manage/cards/add' element={<AddCardsWrapper />} />
          <Route path='/manage/cards/edit' element={<ListCardsWrapper />} />
          <Route path='/manage/cards/edit/:id' element={<EditCardsWrapper />} />
          <Route path='/manage/maps/add' element={<AddMapsWrapper />} />
          <Route path='/manage/maps/edit' element={<ListMapsWrapper />} />
          <Route path='/manage/maps/edit/:id' element={<EditMapsWrapper />} />
          <Route path='/manage/packs/add' element={<AddPacksWrapper />} />
          <Route path='/manage/packs/edit' element={<EditPacksWrapper />} />
          <Route path='/manage/packs/edit/:id' element={<ListPacksWrapper />} />
          <Route path='/manage/fields/add' element={<AddFieldsWrapper />} />
          <Route path='/manage/fields/edit' element={<ListFieldsWrapper />} />
          <Route path='/manage/fields/edit/:id' element={<EditFieldsWrapper />} />
          <Route path='/shop' element={<ShopWrapper />} />
          <Route path='/packs' element={<PacksWrapper />} />
          <Route path='/decks' element={<ManageDeckWrapper />} />
          <Route path='/decks/add' element={<AddDeckWrapper />} />
          <Route path='/decks/edit' element={<ListDeckWrapper />} />
          <Route path='/decks/edit/:id' element={<EditDeckWrapper />} />
          <Route path='/authorizeAccount' element={<AuthorizeWrapper />} />
          <Route path='/sign-in' element={<SignInWrapper />} />
          <Route path='/logout' element={<LogoutWrapper />} />
        </Routes>
        <FooterWrapper />
      </Router>
    )
  }
}

/**
 * Maps states to pass props to app.
 * @param {object} state of all redux store. 
 * @returns object with needed store elements.
 */
const mapStateToProps = (state) => {
  return {
    userLoggedIn: state.userLoggedIn
  }
}

/**
 * All needed variables and function passed.
 */
const mapDispatchToProps = { checkUserLoggedIn }

export default connect(mapStateToProps, mapDispatchToProps)(App)
