import React, { Component } from 'react'
import { BrowserRouter as Router, Routes } from "react-router-dom"
import socketIOClient from 'socket.io-client'
import HeaderWrapper from './header/HeaderWrapper'
import { time } from '../utils/enum/time'
import { menuElements } from '../utils/menu/menuElements'

/**
 * Returns switch with whole app. Entrance point.
 */
class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      socket: socketIOClient(process.env.REACT_APP_GAME_API, { 'transports': ['websocket'], 'force new connection': true }),
      lastSocketState: false,
      tries: 0,
      menuElements: menuElements
    }

    setInterval(this.checkSocketState.bind(this), time.SECOND)
  }

  checkSocketState() {
    if (!this.state.lastSocketState) {
      this.setState({
        tries: this.state.tries + 1
      })
    }

    if (this.state.socket.connected !== this.state.lastSocketState) {
      const tries = (this.state.socket.connected ? 0 : this.state.tries)

      if (this.state.socket.connected) {
        alert(`Connected to server.`)
      }

      this.setState({
        lastSocketState: this.state.socket.connected,
        tries: tries
      })
    }
  }

  componentDidUpdate() {
    if (!this.state.lastSocketState && this.state.tries === 1) {
      alert(`Couldn't connect to server. Try again later.`)
    }
  }

  render() {
    return (
      <Router>
        <HeaderWrapper menuElements={this.state.menuElements} isServerUp={this.state.lastSocketState} />
        <Routes>
        </Routes>
      </Router>
    )
  }
}

export default App
