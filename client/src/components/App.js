// Other modules imports
import { Component } from 'react'
import socketIOClient from 'socket.io-client'

// My variables imports
import { backendAddress } from '../utils/environment'

// Global variables
var socket
var address = backendAddress || "http://localhost:3001/"

class App extends Component {

  // Construct App with websocket connection
  constructor(props) {
    super(props)
    this.state = {socket: socketIOClient(address, {'transports': ['websocket']})}
    socket = this.state.socket
  }

  // Render main element
  render(){
    return(
      <div>

      </div>
    )
  }
}

export { App, socket }
