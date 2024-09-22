import { useEffect, useState } from "react";
import { useNavigate } from "@remix-run/react";
import { FindChats, FindUser } from "~/contexts/UserContext";
import { fetchOrCreatePrivateChat, joinChat } from "~/utils/api/chats";
import { Chat } from "types";
import ListItem from "./ListItem";

export default function ListedChats() {
  const { chats, setActiveChat } = FindChats();
  const { user } = FindUser();
  const [theChats, setTheChats] = useState<Chat[] | null>();
  const navigate = useNavigate();
  console.log("listed", chats);
  useEffect(() => {
    const newChats = chats;
    const sortedChats =
      chats &&
      chats.sort((a, b) => {
        return (
          new Date(b.lastRead?.date || 0).getTime() -
          new Date(a.lastRead?.date || 0).getTime()
        );
      });
    setTheChats(sortedChats);
    console.log("chats changed", chats, newChats);
  }, [chats]);
  console.log(chats, theChats);

  const handleClick = (chat: Chat) => {
    setActiveChat(chat);
    //console.log("click", activeChat, chat);
    join(chat);
    navigate(`/chat/${chat.id}`);
  };

  const join = async (chat: Chat) => {
    //console.log("join fxn", chat);
    if (chat.type === "group") {
      user && (await joinChat(chat.id, user.id));
    } else {
      user &&
        chat.members?.length === 2 &&
        (await fetchOrCreatePrivateChat(chat.members[0], chat.members[1]));
    }
  };

  return (
    <div className="d-flex flex-column bg-light border-end ">
      <div className="p-3 bg-white border-bottom">
        <h5 className="mb-0">Chats</h5>
      </div>
      <ul className="list-group list-group-flush overflow-auto">
        {theChats &&
          theChats.map((chat, i) => (
            <ListItem
              key={`chat-${i}`}
              chat={chat}
              handleClick={() => handleClick(chat)}
            />
          ))}
      </ul>
    </div>
  );
}
