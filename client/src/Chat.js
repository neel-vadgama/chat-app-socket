import React, { useEffect, useState } from "react";
import { nanoid } from "nanoid";
import ScrollToBottom from "react-scroll-to-bottom";

const Chat = ({ socket, username, room }) => {
  const [currentMessage, setCurrentMessage] = useState("");
  const [conversation, setConversation] = useState([]);

  const sendMessage = async () => {
    if (currentMessage !== "") {
      const msgData = {
        id: nanoid(),
        author: username,
        room,
        message: currentMessage,
        time: new Date(Date.now()).toLocaleTimeString("en-us", {
          hour: "numeric",
          minute: "numeric",
          hour12: true,
        }),
      };
      await socket.emit("send_message", msgData);
      setConversation((msgList) => [...msgList, msgData]);
      setCurrentMessage("");
    }
  };

  useEffect(() => {
    socket.on("receive_message", (msg_data) => {
      setConversation((msgList) => [...msgList, msg_data]);
    });
  }, [socket]);

  return (
    <div className="container">
      <div className="chat-header">
        <h4>Live chat - Room {room}</h4>
      </div>
      <div className="chat-body">
        <ScrollToBottom className="chat-content">
          {conversation.map((eachMessage) => {
            return (
              <div
                key={eachMessage.id}
                className="message"
                id={username === eachMessage.author ? "you" : "other"}
              >
                <div className="message-content">
                  <p>{eachMessage.message}</p>
                </div>
                <div className="message-info">
                  <p id="author">{eachMessage.author}</p>
                  <p id="time">{eachMessage.time}</p>
                </div>
              </div>
            );
          })}
        </ScrollToBottom>
      </div>
      <div className="chat-footer">
        <input
          type="text"
          name="message"
          placeholder="Send a message.."
          value={currentMessage}
          onChange={(e) => setCurrentMessage(e.target.value)}
          onKeyPress={(e) => {
            e.key === "Enter" && sendMessage();
          }}
        />
        <button onClick={sendMessage}>&#9658;</button>
      </div>
    </div>
  );
};

export default Chat;
