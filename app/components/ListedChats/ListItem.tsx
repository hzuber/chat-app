import { useEffect, useState } from "react";
import { Chat } from "../../../types";
import { FindUser } from "~/contexts/UserContext";
import { getUserById } from "~/utils/api/users";

interface Props {
  chat: Chat;
  handleClick: (c: Chat) => void;
}

export default function ListItem({ chat, handleClick }: Props) {
  const { user } = FindUser();
  const [name, setName] = useState<string | null>(null);

  useEffect(() => {
    const findOtherUser = async () => {
      try {
        if (chat) {
          const otherId = chat.members?.find((c) => c !== user?.id);
          if (otherId) {
            const res = await getUserById(otherId);
            return res;
          }
          return null;
        } else {
          return null;
        }
      } catch (error) {
        return null;
      }
    };

    if (chat.type === "private" && user) {
      findOtherUser().then((res) => {
        if (res && res.username) {
          setName(res.username);
        }
      });
    } else {
      chat.title && chat.title.length > 0 && setName(chat.title);
    }
  }, [chat, user]);

  return (
    <button
      className="list-group-item list-group-item-action d-flex align-items-start"
      onClick={() => handleClick(chat)}
    >
      <div className="me-3">
        <div
          className="rounded-circle bg-secondary"
          style={{ width: "40px", height: "40px" }}
        ></div>
      </div>
      <div className="flex-grow-1 text-start">
        <h6 className="mb-1">{name || "Untitled Chat"}</h6>
        <p className="small text-muted mb-0">
          {chat.messages && chat.messages.length > 0
            ? chat.messages[chat.messages.length - 1].message
            : "No messages yet"}
        </p>
      </div>
      <small className="text-muted">
        {chat.lastRead?.date
          ? new Date(chat.lastRead.date).toLocaleTimeString()
          : ""}
      </small>
    </button>
  );
}
