import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { FindUser } from "~/contexts/UserContext";
import { useSocket } from "~/contexts/SocketContext";
import { Message } from "types";
import { PageLayout } from "~/components/PageLayout";
import { useParams, useNavigate } from "@remix-run/react";

export default function Chat() {
  const { socket: contextSocket } = useSocket();
  const { user } = FindUser();
  const [socket, setSocket] = useState<Socket | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const roomId = useParams().chatId;
  const userId = user?.id;
  const navigate = useNavigate();
  console.log("chat");

  // useEffect(() => {
  //   if (!user) {
  //     navigate("/login");
  //   }
  // }, [user, navigate]);

  useEffect(() => {
    setSocket(contextSocket);
    if (socket && userId) {
      socket.emit("join-room", { roomId, userId });

      // Listen for incoming messages
      socket.on("receive-message", (message) => {
        setMessages((prevMessages) => [...prevMessages, message]);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [contextSocket, roomId, userId, socket]);

  const sendMessage = () => {
    if (newMessage.trim()) {
      socket &&
        socket.emit("send-message", {
          roomId,
          userId,
          message: newMessage,
        });
      setNewMessage("");
    }
  };

  return (
    <PageLayout>
      <div className="container">
        <div className="chat-box card">
          <div className="card-header">
            <h5>Chat Room</h5>
          </div>
          <div className="card-body">
            {messages.map((msg, index) => (
              <div key={index} className="message">
                <strong>{user?.username}:</strong> {msg.message}
              </div>
            ))}
          </div>
          <div className="card-footer input-group">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              className="form-control"
              placeholder="Type a message..."
            />
            <div className="input-group-append">
              <button className="btn btn-primary" onClick={sendMessage}>
                Send
              </button>
            </div>
          </div>
        </div>
      </div>
    </PageLayout>
  );
}

// import type { MetaFunction } from "@remix-run/node";
// import { useState, useEffect } from "react";
// import { Socket } from "socket.io-client";
// import { useSocket } from "~/contexts/SocketContext";

// export const meta: MetaFunction = () => {
//   return [
//     { title: "New Remix App" },
//     { name: "description", content: "Welcome to Remix!" },
//   ];
// };
// interface Messages {
//   username: string;
//   text: string;
// }

// export default function Chat() {
//   const { socket: contextSocket } = useSocket();
//   const [socket, setSocket] = useState<Socket | null>();
//   const [messages, setMessages] = useState<Messages[]>([]);
//   const [messageText, setMessageText] = useState("");

//   useEffect(() => {
//     console.log("use effect");
//   }, []);

//   useEffect(() => {
//     setSocket(contextSocket);
//     if (socket) {
//       socket.on("confirmation", (data) => {
//         console.log(data);
//       });
//       socket.on("message", (message) => {
//         console.log(message);
//         setMessages([...messages, message]);
//       });
//     }
//   }, [contextSocket, messages, socket]);

//   const sendMessage = () => {
//     console.log("messageText", messageText);
//     socket?.emit("message", { text: messageText, username: "Me" });
//     setMessageText(messageText);
//   };
//   return (
//     <>
//       <div className="messages">
//         {messages.map((message, index) => (
//           <p key={index}>
//             username: {message.username} <br /> text={message.text}
//           </p>
//         ))}
//       </div>
//       <div className="input-box">
//         <input
//           type="text"
//           value={messageText}
//           onChange={(e) => {
//             setMessageText(e.target.value), console.log("click");
//           }}
//           placeholder="Type your message..."
//         />
//         <button onClick={() => sendMessage()}>Send</button>
//       </div>
//     </>
//   );
// }
