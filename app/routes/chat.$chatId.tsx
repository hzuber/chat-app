import type { MetaFunction } from "@remix-run/node";
import { useState, useEffect } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "~/contexts/SocketContext";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};
interface Messages {
  username: string;
  text: string;
}

export default function Chat() {
  const { socket: contextSocket } = useSocket();
  const [socket, setSocket] = useState<Socket | null>();
  const [messages, setMessages] = useState<Messages[]>([]);
  const [messageText, setMessageText] = useState("");

  useEffect(() => {
    console.log("use effect");
  }, []);

  useEffect(() => {
    setSocket(contextSocket);
    if (socket) {
      socket.on("confirmation", (data) => {
        console.log(data);
      });
      socket.on("message", (message) => {
        console.log(message);
        setMessages([...messages, message]);
      });
    }
  }, [contextSocket, messages, socket]);

  const sendMessage = () => {
    console.log("messageText", messageText);
    socket?.emit("message", { text: messageText, username: "Me" });
    setMessageText(messageText);
  };
  return (
    <>
      <div className="messages">
        {messages.map((message, index) => (
          <p key={index}>
            username: {message.username} <br /> text={message.text}
          </p>
        ))}
      </div>
      <div className="input-box">
        <input
          type="text"
          value={messageText}
          onChange={(e) => {
            setMessageText(e.target.value), console.log("click");
          }}
          placeholder="Type your message..."
        />
        <button onClick={() => sendMessage()}>Send</button>
      </div>
    </>
  );
}
