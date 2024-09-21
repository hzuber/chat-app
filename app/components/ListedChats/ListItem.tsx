import { useState } from "react";
import { Chat, User } from "../../../types";
import { fetchOrCreatePrivateChat, getChat, joinChat } from "~/utils/api/chats";
import { FindUser } from "~/contexts/UserContext";
import { Outlet } from "@remix-run/react";
import { getAll } from "server/users/utils";
import { getUserById } from "~/utils/api/users";

interface Props {
  id: string;
}

export default function ListItem({ id }: Props) {
  const { user } = FindUser();
  const [chat, setChat] = useState<Chat | null>();
  const [name, setName] = useState<string>("");
  findUser(id);

  const handleClick = (personId: string) => {
    if (user && chat) {
      chat.type === "private"
        ? fetchOrCreatePrivateChat(personId, user.id)
        : joinChat(chat.id, user.id);
    }
  };

  async function findUser(chatId: string) {
    const chat = await getChat(chatId);
    setChat(chat);
    const otherUserId: string | undefined = chat?.members?.find(
      (m) => m !== user?.id
    );
    if (otherUserId) {
      const theUser: User | null = await getUserById(otherUserId);
      theUser ? setName(theUser?.username) : setName("");
    }
  }

  return <button onClick={() => handleClick(id)}>{name}</button>;
}
