import { Outlet, useMatches } from "@remix-run/react";
import useScreenWidth from "~/utils/hooks/useScreenWidth";
import { PageLayout } from "~/components/PageLayout";
import ListedChats from "~/components/ListedChats/ListedChats";
import { FindChats } from "~/contexts/UserContext";

export default function Index() {
  const { chats } = FindChats();
  //console.log("chats", chats);
  const isMobile = useScreenWidth();
  const matches = useMatches();
  const isChildRoute = matches.some((match) => match.params["chatId"]);

  return (
    <PageLayout>
      <div className="d-flex justify-content-between h-100">
        <ListedChats />
        {isMobile && isChildRoute ? (
          <PageLayout>
            <Outlet />
          </PageLayout>
        ) : (
          <div className="inline-child-view w-75 h-100">
            {isChildRoute ? (
              <Outlet />
            ) : (
              <p>Click on a username or chat room to start a chat!</p>
            )}
          </div>
        )}
      </div>
    </PageLayout>
  );
}
