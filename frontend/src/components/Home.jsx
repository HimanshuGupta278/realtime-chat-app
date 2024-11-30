import { useEffect, useState } from "react"
import { socket } from "../utils/socket"

export default function Home({ roomId, setRoomId, username, setUsername }) {
    const [action, setAction] = useState('Create')

    const handleActionSelector = (e) => {
        setAction(e.target.value)
    }

    const handleSubmit = (e) => {
        e.preventDefault();
        let event = action === 'Create' ? 'create room' : 'join room'
        socket.emit(event, roomId)
    }

    return (
        <div className="h-screen w-screen flex items-center justify-center">
            <form className="flex flex-col bg-gray-600 text-xl space-y-5 p-5 rounded-md">
                <div className="space-x-4">
                    <label htmlFor="username">Enter Username:</label>
                    <input value={username} onChange={(e) => {
                        setUsername(e.target.value)
                    }} type="text" name="username" className="rounded-md py-1 px-3" />
                </div>

                <div className="space-x-4">
                    <label htmlFor="roomId">Enter Room ID:</label>
                    <input value={roomId} onChange={(e) => {
                        setRoomId(e.target.value)
                    }} type="text" name="roomId" className="rounded-md py-1 px-3" />
                </div>

                <select defaultValue={action} onChange={handleActionSelector} name="actionSelector" id="actionSelector" className="rounded-md py-1 px-3">
                    <option value="Create">Create Room</option>
                    <option value="Join">Join Room</option>
                </select>

                <button onClick={handleSubmit} type="submit" className="bg-blue-700 rounded-md py-1">{action}</button>
            </form>
        </div>
    )
}