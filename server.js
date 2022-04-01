const express = require('express')
const http = require('http')
const { v4: uuidv4 } = require('uuid')
const { ExpressPeerServer } = require('peer')

const PORT = process.env.PORT || 8080

const app = express()

const server = http.Server(app)

const io = require('socket.io')(server)

const peerServer = ExpressPeerServer(server, {
  debug: true,
})

app.use('/peerjs', peerServer)

app.use(express.static('public'))

app.set('view engine', 'ejs')

app.get('/', (req, res) => {
  res.redirect(`/${uuidv4()}`)
})

app.get('/:room', (req, res) => {
  res.render('room', { roomId: req.param.room })
})

io.on('connection', (socket) => {
  socket.on('join-room', (roomId, userId) => {
    socket.join(roomId)
    socket.to(roomId).broadcast.emit('user-connected', userId)
  })
})

server.listen(PORT)