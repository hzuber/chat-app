import { Outlet, useMatches, useLocation } from "@remix-run/react";
import { useState, useEffect } from "react";
import { FindUser } from "~/contexts/UserContext";
import useScreenWidth from "~/utils/hooks/useScreenWidth";
import { PageLayout } from "~/components/PageLayout";
import ListedChats from "~/components/ListedChats/ListedChats";
import { getUsers } from "~/utils/api/users";
import { Chat, User } from "../../types";
import { getChats } from "~/utils/api/chats";

export default function Index() {
  const { user } = FindUser();
  const [chats, setChats] = useState<Chat[] | null>();
  const [otherUsers, setOtherUsers] = useState<User[] | null>(null);
  const isMobile = useScreenWidth();
  const location: Location = useLocation();
  const matches = useMatches();
  const isChildRoute = matches.some((match) => match.params["chatId"]);
  console.log("isChildRoute", isChildRoute);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const theUsers: User[] | null = await getUsers();
        return theUsers;
      } catch {
        return null;
      }
    };

    fetchUsers().then((users: User[] | null) => {
      if (users) {
        const others: User[] = users.filter((u) => u.id !== user?.id);
        setOtherUsers(others);
      } else {
        setOtherUsers(null); // Optionally set to null if needed
      }
    });
  }, [user]);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const theChats: Chat[] | null = await getChats();
        return theChats;
      } catch {
        return null;
      }
    };

    fetchChats().then((theChats: Chat[] | null) => {
      if (theChats) {
        setChats((prevChats) => {
          // Only update state if the chats have actually changed
          if (JSON.stringify(prevChats) !== JSON.stringify(theChats)) {
            return theChats;
          }
          return prevChats;
        });
      } else {
        setChats(null); // Set to null if needed
      }
    });
  }, []);

  return (
    <PageLayout>
      <div className="d-flex justify-content-between h-100">
        {chats && <ListedChats chats={chats} />}
        {isMobile && isChildRoute ? (
          <PageLayout>
            <Outlet />
          </PageLayout>
        ) : (
          <div className="inline-child-view w-75 h-100">
            {/* Inline view for desktop when child route is active */}
            <Outlet />
          </div>
        )}
      </div>
    </PageLayout>
  );
}
