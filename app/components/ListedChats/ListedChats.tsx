import React from "react";
import { Chat, User } from "../../../types";
import { fetchOrCreatePrivateChat, getChat } from "~/utils/api/chats";
import { FindUser } from "~/contexts/UserContext";
import { Outlet } from "@remix-run/react";
import { getAll } from "server/users/utils";
import { getUserById } from "~/utils/api/users";
import ListItem from "./ListItem";

interface Props {
  chats: Chat[] | null;
}

export default function ListedChats({ chats }: Props) {
  return (
    <div className="d-flex h-100">
      {/* Left sidebar for people/chats list */}
      <ul>
        {chats && chats.map((chat) => <ListItem key={chat.id} id={chat.id} />)}
      </ul>
    </div>
  );
}
