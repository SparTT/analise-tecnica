import { Server } from 'socket.io'


let i = 0

const SocketHandler = (req, res) => {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')

    const io = new Server(res.socket.server)

    io.on('connection', socket => {
      // broadcast manda a msg pra td mundo, menos pra quem enviou
      socket.broadcast.emit('a user connected')
      socket.on('hello', msg => {
        console.log(msg)
      })

    })

    
    setInterval(() => {
      let res = 'Number: ' + i
      io.emit('interval', res)
      i++
    }, (3000));





    res.socket.server.io = io

  } else {
    console.log('socket.io already running')
    let io = res.socket.server.io
  }
  res.end()
}


export default SocketHandler