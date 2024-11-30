import { useEffect, useState } from "react"
import { socket } from "./utils/socket"
import Home from './components/Home'
import Chat from "./components/Chat"

function App() {
  const [username, setUsername] = useState('')
  const [isConnected, setIsConnected] = useState(socket.connected)
  const [roomId, setRoomId] = useState('')
  const [messages, setMessages] = useState([]);

  useEffect(() => {
      socket.connect()
      socket.on('connected', (roomId)=>{
        console.log(`Joined Room ${roomId}`)
        setIsConnected(true)
      })

      socket.on('user joined', (membersSid)=>{
        console.log(`User joined ${membersSid}`)
        console.log(isConnected)
      })

      socket.on('chat', (msg)=>{
        setMessages((prevMessages) => [...prevMessages, msg]);
        console.log(messages)
      })

      return () => {
        socket.off('connected');
        socket.off('user joined');
        socket.off('chat');
        socket.disconnect();
      }; 

  }, [])
  return (
    <> 
      {!isConnected ? <Home roomId={roomId} setRoomId={setRoomId} username={username} setUsername={setUsername}/> : <Chat roomId={roomId} messages={messages} setMessages={setMessages} username={username}/>}
    </>
  )
}

export default App
