import { useEffect, useState, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { Socket } from "socket.io-client";
import { FindChats, FindUser } from "~/contexts/UserContext";
import { useSocket } from "~/contexts/SocketContext";
import { Message } from "types";
import { usePageVisibility } from "~/utils/hooks/usePageVisibility";
import { useMessageVisibility } from "~/utils/hooks/useMessageVisibility";
import { useParams } from "@remix-run/react";
import { EditModal } from "~/components/Modals/EditModal";
import {
  createMessage,
  getMessagesByChat,
  markMessageRead,
} from "~/utils/api/messages";
import { getUserById } from "../utils/api/users";
import { useNavigate } from "react-router-dom";
import {
  createGroupChat,
  editChat,
  getChat,
  // fetchOrCreatePrivateChat,
} from "~/utils/api/chats";

// type MessageWithUser = {
//   message: Message;
//   user: User;
// };

export default function ChatRoom() {
  const { activeChat, setActiveChat, setChats, chats, updateChats } =
    FindChats();
  const { socket: contextSocket } = useSocket();
  const { user } = FindUser();
  const [socket, setSocket] = useState<Socket | null>();
  // const [chat, setChat] = useState<Chat | null>();
  const [messages, setMessages] = useState<Message[]>([]);
  const [otherMember, setOtherMember] = useState<string>("");
  const [newMessage, setNewMessage] = useState("");
  const [fieldValue, setFieldValue] = useState("");
  const [fieldBeingEdited, setFieldBeingEdited] = useState<string>("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const chatId = useParams().chatId;
  const userId = user ? user.id : null;

  const messageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Create the Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (
            entry.isIntersecting &&
            entry.target.getAttribute("data-is-read") === "read-false"
          ) {
            const messageId = entry.target.getAttribute("data-message-id");
            const authorId = entry.target.getAttribute("data-author-id");
            if (authorId !== user?.id) {
              console.log(
                "message_read",
                entry.target.getAttribute("data-is-read") === "read-false",
                messageId,
                chatId,
                authorId,
                user?.id,
                authorId !== user?.id
              );
              socket?.emit("message_read", { messageId, chatId });
              console.log("message read");
            }
          }
        });
      },
      { threshold: 0.5 } // 50% of the message must be visible
    );

    // Observe each message ref
    messageRefs.current.forEach((ref) => {
      if (ref) {
        observer.observe(ref);
      }
    });

    // Cleanup observer on unmount
    return () => {
      observer.disconnect();
    };
  }, [messages, socket, chatId, user?.id]);

  useEffect(() => {
    if (chatId && userId) {
      const joinChatAndFetchHistory = async () => {
        console.log("activeChat 0", "chatId", chatId, activeChat);
        if (chatId !== activeChat?.id) {
          console.log("no activeChat, find a chat...");
          const findChat = await getChat(chatId);
          if (!findChat) {
            navigate("/chat");
          }
          setActiveChat(findChat);

          // Fetch chat history
          const history = await getMessagesByChat(chatId);
          setMessages(history);

          if (findChat?.type === "private") {
            const otherUserId = findChat.members?.find(
              (id: string) => id !== userId
            );
            if (otherUserId) {
              const otherUser = await getUserById(otherUserId);
              setOtherMember(otherUser?.username || "");
            }
          }
        }
      };
      joinChatAndFetchHistory();
    }
  }, [chatId, userId, activeChat, navigate]);

  useEffect(() => {
    setSocket(contextSocket);

    if (socket && userId) {
      socket.emit("join-chat", { chatId, userId });

      // Listen for incoming messages
      socket.on("receive-message", async (message) => {
        console.log(message);
        // updateChats();
        console.log("received message", message, chats);
        createNewMessage(message.authId, message.uuid, message.message);
      });

      // Cleanup: Remove the listener when the component unmounts or dependencies change
      return () => {
        if (socket) {
          socket.off("receive-message");
        }
      };
    }
  }, [contextSocket, socket, chatId, userId]);

  useEffect(() => {
    // setSocket(contextSocket);

    if (!contextSocket || !userId) {
      console.log("no contextSocket");
      return;
    }

    if (contextSocket && userId) {
      contextSocket.on("message_marked_read", async ({ messageId, chatId }) => {
        const response = chatId && (await markMessageRead(messageId, chatId));

        if (response) {
          setMessages((prevMessages) =>
            prevMessages.map((message) =>
              message.id === messageId ? { ...message, ...response } : message
            )
          );
        }
        console.log("message_marked_read", messageId, chatId, response);
      });

      // Cleanup: Remove the listener when the component unmounts or dependencies change
      return () => {
        if (socket) {
          socket.off("message_marked_read off");
        }
      };
    }
  }, [chatId, userId]);

  async function sendMessage(authorId: string) {
    const uuid = uuidv4();
    console.log("sendMessage", authorId);
    if (newMessage.trim()) {
      socket &&
        socket.emit("send-message", {
          chatId,
          authId: authorId,
          uuid,
          message: newMessage,
        });
      console.log("should send to socket", chatId, uuid, authorId, newMessage);
    }
    // await createNewMessage(authorId, uuid);
  }

  async function createNewMessage(
    authorId: string,
    uuid: string,
    message: string
  ) {
    if (chatId && userId) {
      try {
        console.log("message created", chatId, authorId);
        const response = await createMessage(
          chatId,
          authorId,
          false,
          message,
          uuid,
          null
        );

        console.log("message created 22", response);
        if (response) {
          setMessages((prevMessages) => [...prevMessages, response]);
          console.log("setMessages", messages);
          setChats((prevChats) => {
            if (!prevChats) return prevChats;
            return prevChats.map((chat) =>
              chat.id === response.chatId
                ? {
                    ...chat,
                    messages: [...(chat.messages || []), response],
                    lastRead: response,
                  }
                : chat
            );
          });
          console.log("setting chats...", chats);

          setNewMessage("");
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
          setActiveChat(updatedChat); // Update local chat state
          setIsModalOpen(false); // Close the modal
        }
      } catch (error) {
        //console.error(`Error updating ${fieldBeingEdited}:`, error);
      }
    }
  }
  return (
    <div className="container">
      <div className="chat-box card">
        <div className="card-header">
          <h5>
            {activeChat?.type === "private"
              ? otherMember
              : activeChat?.title || "Untitled Chat Room"}
          </h5>
          {activeChat?.type === "group" && (
            <p>{activeChat?.description || "No Description"}</p>
          )}
          {/* Buttons to trigger modal for editing fields */}
          {activeChat?.type === "group" && (
            <>
              <button
                className="btn btn-link"
                onClick={() => openEditModal("title", activeChat?.title || "")}
              >
                Edit Title
              </button>
              <button
                className="btn btn-link"
                onClick={() =>
                  openEditModal("description", activeChat?.description || "")
                }
              >
                Edit Description
              </button>
            </>
          )}
        </div>
        <div className="card-body">
          {messages.map((msg, index) => (
            <div
              key={index}
              ref={(el) => (messageRefs.current[index] = el)} // Attach ref to each message element
              data-message-id={msg.id} // Set message ID for observer
              data-author-id={msg.userId}
              data-is-read={`read-${msg.read}`}
              className="message"
            >
              <strong>
                {msg.userId === user?.id
                  ? "me"
                  : activeChat?.type === "private"
                  ? otherMember
                  : activeChat?.title}
                :{msg.userId === user?.id} {activeChat?.type} {otherMember}{" "}
                {activeChat?.title}
              </strong>{" "}
              {msg.message}
              {/* Checkmark icon based on read status */}
              <span className="ms-2">
                {msg.read ? (
                  <i className="bi bi-check-all text-primary"></i> // Two blue checkmarks if read
                ) : (
                  <i className="bi bi-check-all text-muted"></i> // Grayed-out checkmarks if not read
                )}
              </span>
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
            <button
              className="btn btn-primary"
              onClick={() => userId && sendMessage(userId)}
            >
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
}
