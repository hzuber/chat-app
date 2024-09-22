import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { Socket, io } from "socket.io-client";
import {
  fetchOrCreatePrivateChat,
  getChats as getAllChats,
} from "~/utils/api/chats";
import { getUsers as getAllUsers } from "~/utils/api/users";
import { validateToken } from "~/utils/api/auth";
import { Chat, User, userChat } from "../../types";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
  createOrFetchChat: (chat: userChat) => Promise<Chat | null | undefined>;
  chats: Chat[] | null | undefined;
  setChats: React.Dispatch<React.SetStateAction<Chat[] | null | undefined>>;
  activeChat: Chat | null;
  setActiveChat: React.Dispatch<React.SetStateAction<Chat | null>>;
}

interface Props {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  const [chats, setChats] = useState<Chat[] | null>();
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  // console.log("context ran", chats);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      validateToken().then((userData) => {
        if (userData) {
          setIsLoading(false);
          setUser(userData);
        } else {
          localStorage.removeItem("token");
          if (!isPublicRoute(location.pathname)) {
            navigate("/login");
          }
          return;
        }
      });
    } else {
      location.pathname !== "/signup" && navigate("/login");
    }
  }, [navigate, location.pathname]);

  useEffect(() => {
    const fetchChatsAndUsers = async () => {
      const newChats: Chat[] = []; // Store new chats temporarily
      const controller = new AbortController();
      try {
        const chats = await getAllChats();
        const users = await getAllUsers();
        if (user && chats) {
          const userChats = chats.filter((chat: Chat) =>
            chat.members?.includes(user.id)
          );
          //console.log("newChats", newChats);
          newChats.push(...userChats);
        }
        if (user && users) {
          for (const u of users) {
            const chat = await fetchOrCreatePrivateChat(u.id, user.id);
            const duplicateChat = newChats.find((nc) => nc.id == chat.id);
            //console.log(duplicateChat, "duplicateChat");
            if (chat) {
              //console.log("fetchOrCreatePrivateChat", chat);
              newChats.push(chat); // Add private chats
            }
          }
        }

        const filterChats = newChats.filter((c) => !chats?.includes(c));
        setChats(() => [...filterChats]);

        return chats;
      } catch (error) {
        //console.error("Error fetching chats and users:", error);
      }
      return () => controller.abort();
    };

    if (user) {
      fetchChatsAndUsers();
    }
  }, [user]);

  const createOrFetchChat = async (chat: userChat) => {
    let chatRoom: Chat | null;
    try {
      if (chat.isUser && user) {
        const response = await fetchOrCreatePrivateChat(chat.id, user.id);
        if (response) {
          chatRoom = await response.json();
        }
      } else {
        chatRoom = chat.chat;

        return chatRoom;
      }
    } catch (error) {
      //console.error("Error creating/fetching chat room", error);
      return null;
    }
  };

  const login = (userData: User, token: string) => {
    setUser(userData);
    localStorage.setItem("token", token);
    navigate("/chat");
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("token");
    navigate("/login");
  };
  const isPublicRoute = (pathname: string) => {
    const publicRoutes = ["/", "/signup", "/login"];
    return publicRoutes.includes(pathname) || pathname.startsWith("/chat/");
  };

  //console.log("checkContext", chats);
  return (
    <UserContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        createOrFetchChat,
        chats,
        setChats,
        activeChat,
        setActiveChat,
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export function FindUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("findUser must be used within a UserProvider");
  }
  return {
    user: context.user,
    isLoading: context.isLoading,
    login: context.login,
    logout: context.logout,
  };
}

export function FindChats() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("findChat must be used within a UserProvider");
  }
  return {
    chats: context.chats,
    activeChat: context.activeChat,
    createOrFetchChat: context.createOrFetchChat,
    setActiveChat: context.setActiveChat,
    setChats: context.setChats,
  };
}
