import "./App.css";
import io from "socket.io-client";
import { useState } from "react";
import Chat from "./Chat";

const socket = io.connect("http://localhost:4000");

function App() {
  const [username, setUsername] = useState("");
  const [room, setRoom] = useState("");
  const [showChat, setshowChat] = useState(false);

  const joinRoom = () => {
    if (username !== "" && room !== "") {
      socket.emit("join_room", room);
    }
    setshowChat(true);
  };

  return (
    <div className="App">
      {!showChat ? (
        <div className="chat-room">
          <h1 className="chat-room-header">Join A Chat Room</h1>
          <input
            type="text"
            autoComplete="off"
            id="input-box"
            name="username"
            placeholder="Enter username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            autoComplete="off"
            id="input-box"
            name="room"
            placeholder="Enter Room-id"
            value={room}
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom} className="room-btn">
            join room
          </button>
        </div>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  );
}

export default App;
