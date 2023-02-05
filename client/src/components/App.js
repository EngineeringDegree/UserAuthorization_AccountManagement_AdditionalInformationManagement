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
      menuElements: menuElements,
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
    let menuElements = that.state.menuElements
    if (that.props.userLoggedIn.response === responses.REQUESTING_ACCOUNT_AUTHORIZATION || that.props.userLoggedIn.response === responses.NO_TOKENS_EMAIL || that.props.userLoggedIn.status === responses.USER_NOT_AUTHORIZED || !that.state.socket.connected) {
      menuElements = menuElements.filter((e) => {
        return !e.loggedIn || e.alwaysVisible
      })

      return menuElements
    }

    if (window.localStorage.getItem('email') == null || window.localStorage.getItem('token') == null || window.localStorage.getItem('refreshToken') == null) {
      menuElements = menuElements.filter((e) => {
        return !e.loggedIn || e.alwaysVisible
      })

      return menuElements
    }

    if (that.props.userLoggedIn.token && that.props.userLoggedIn.token !== window.localStorage.getItem('token')) {
      that.setState({
        token: window.localStorage.getItem('token')
      })
    }

    if (that.props.userLoggedIn.admin) {
      menuElements = menuElements.filter((e) => {
        return e.loggedIn || e.alwaysVisible
      })
      return menuElements
    }

    menuElements = menuElements.filter((e) => {
      return (!e.admin && e.loggedIn) || e.alwaysVisible
    })

    return menuElements
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
