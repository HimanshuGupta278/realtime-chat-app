import { useState } from "react";
import { socket } from "../utils/socket";

export default function Chat({ roomId, messages, setMessages, username }) {

    const [newMessage, setNewMessage] = useState("");

    const handleSendMessage = () => {
        if (newMessage.trim() === "") return;

        const newMsg = {
            id: messages.length + 1,
            roomId,
            sender: username,
            content: newMessage,
        };

        setMessages((prevMessages) => [...prevMessages, newMsg]);
        socket.emit('chat', newMsg)
        setNewMessage("");
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            {/* Header */}
            <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2 shadow-md">
                <h1 className="text-lg font-semibold">Chat Room</h1>
                <span className="text-sm">Online</span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((message) => (
                    <div
                        key={message.id}
                        className={`flex ${message.sender === username ? "justify-end" : "justify-start"
                            }`}
                    >
                        <div
                            className={`max-w-xs px-4 py-2 rounded-lg shadow ${message.sender === "You"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-200 text-gray-800"
                                }`}
                        >
                            <p className="font-semibold">{(message.sender !== username) && message.sender }</p>
                            <p>{message.content}</p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Input Box */}
            <div className="flex items-center p-4 bg-gray-200">
                <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    placeholder="Type a message..."
                    className="flex-1 px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                    onClick={handleSendMessage}
                    className="ml-4 px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 focus:outline-none"
                >
                    Send
                </button>
            </div>
        </div>
    );
};
