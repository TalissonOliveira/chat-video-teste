let myVideoStream
const socket = io('/')
const videoGrid = document.getElementById("video-grid")
const myVideo = document.createElement("video")

var peer = new Peer(undefined, {
  path: '/peerjs',
  host: '/',
  port: '3030',
  })

myVideo.muted = true
navigator.mediaDevices
  .getUserMedia({
    audio: true,
    video: true,
  })
  .then((stream) => {
    myVideoStream = stream
    addVideoStream(myVideo, stream)

    peer.on("call", (call) => {
      call.answer(stream)
      const video = document.createElement("video")
      call.on("stream", (userVideoStream) => {
        addVideoStream(video, userVideoStream)
      })
    })

    socket.on("user-connected", (userId) => {
      connectToNewUser(userId, stream)
    })
  })

const connectToNewUser = (userId, stream) => {
  const call = peer.call(userId, stream)
  const video = document.createElement("video")
  call.on("stream", (userVideoStream) => {
    addVideoStream(video, userVideoStream)
  })
}

peer.on("open", (id) => {
  socket.emit("join-room", ROOM_ID, id, user)
})

const addVideoStream = (video, stream) => {
  video.srcObject = stream
  video.addEventListener("loadedmetadata", () => {
    video.play()
    videoGrid.append(video)
  })
}