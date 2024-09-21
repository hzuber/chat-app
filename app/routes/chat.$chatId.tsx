import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";
import { FindUser } from "~/contexts/UserContext";
import { useSocket } from "~/contexts/SocketContext";
import { Message, Chat } from "types";
import { PageLayout } from "~/components/PageLayout";
import useScreenWidth from "~/utils/hooks/useScreenWidth";
import { useParams } from "@remix-run/react";
import { EditModal } from "~/components/Modals/EditModal";
import { createMessage, getMessagesByChat } from "~/utils/api/messages";
import { getUserById } from "../utils/api/users";
import { editChat, fetchOrCreatePrivateChat } from "~/utils/api/chats";

// type MessageWithUser = {
//   message: Message;
//   user: User;
// };

const ChatRoom = () => {
  const { socket: contextSocket } = useSocket();
  const { user } = FindUser();
  const [socket, setSocket] = useState<Socket | null>();
  const [chat, setChat] = useState<Chat | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherMember, setOtherMember] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const isMobile = useScreenWidth();

  const chatId = useParams().chatId;
  const userId = user ? user.id : null;

  useEffect(() => {
    if (chatId && userId) {
      const joinChatAndFetchHistory = async () => {
        try {
          const chat = await fetchOrCreatePrivateChat(chatId, userId); // Fetch or create one-on-one chat

          if (chat) {
            setChat(chat);
            const history = await getMessagesByChat(chatId); // Fetch chat history
            if (history) {
              setMessages(history); // Set message history
            }

            // Find the other member in one-on-one chat
            const otherUserId = chat.members.find(
              (id: string) => id !== userId
            );
            const otherUser = await getUserById(otherUserId); // Assuming you have a getUserById function
            otherUser && setOtherMember(otherUser.username); // Set the other member's name
          }
        } catch (error) {
          console.error("Error joining chat and fetching history:", error);
        }
      };

      joinChatAndFetchHistory();
    }
  }, [chatId, userId]);

  useEffect(() => {
    setSocket(contextSocket);

    if (socket && userId) {
      socket.emit("join-chat", { chatId, userId });

      // Listen for incoming messages
      socket.on("receive-message", async (message) => {
        console.log(message);
        await createNewMessage(message);
      });

      // Cleanup: Remove the listener when the component unmounts or dependencies change
      return () => {
        if (socket) {
          socket.off("receive-message");
        }
      };
    }
  }, [contextSocket, socket, chatId, userId]);

  async function createNewMessage(message: Message) {
    if (chatId && userId) {
      try {
        // Create the message on the server-side
        const response = await createMessage(
          chatId,
          userId,
          false,
          message.message,
          user
        );
        if (response) {
          // Append the new message to the messages state
          setMessages((prevMessages) => [...prevMessages, response]);
          setNewMessage(""); // Clear the input after a successful message creation
        }
      } catch (error) {
        console.error("Error creating message:", error);
      }
    }
  }

  const openEditModal = (field: string, value: string) => {
    setFieldBeingEdited(field);
    setFieldValue(value);
    setIsModalOpen(true);
  };

  // Handle saving the edited field
  async function handleSaveField(value: string) {
    if (chatId && fieldBeingEdited && value.trim()) {
      try {
        const updatedChat = await editChat(chatId, fieldBeingEdited, value); // Update the field
        if (updatedChat) {
          console.log(`${fieldBeingEdited} updated successfully`);
          setChat(updatedChat); // Update local chat state
          setIsModalOpen(false); // Close the modal
        }
      } catch (error) {
        console.error(`Error updating ${fieldBeingEdited}:`, error);
      }
    }
  }

  async function sendMessage() {
    console.log("in sendmessage", newMessage);
    if (newMessage.trim()) {
      socket &&
        socket.emit("send-message", {
          chatId,
          userId,
          message: newMessage,
        });
    }
  }

  return (
    <div className="container">
      <div className="chat-box card">
        <div className="card-header">
          <h5>
            {chat?.type === "private"
              ? otherMember
              : chat?.title || "Untitled Chat Room"}
          </h5>
          <p>{chat?.description || "No Description"}</p>
          {/* Buttons to trigger modal for editing fields */}
          {chat?.type === "group" && (
            <>
              <button
                className="btn btn-link"
                onClick={() => openEditModal("title", chat?.title || "")}
              >
                Edit Title
              </button>
              <button
                className="btn btn-link"
                onClick={() =>
                  openEditModal("description", chat?.description || "")
                }
              >
                Edit Description
              </button>
            </>
          )}
        </div>
        <div className="card-body">
          {messages.map((msg, index) => (
            <div key={index} className="message">
              <strong>{msg.user?.username}:</strong> {msg.message}
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
      <EditModal
        isOpen={isModalOpen}
        field={fieldBeingEdited}
        value={fieldValue}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSaveField}
      />
    </div>
  );
};
export default ChatRoom;
