import { Outlet, useMatches, useLocation } from "@remix-run/react";
import useScreenWidth from "~/utils/hooks/useScreenWidth";
import { PageLayout } from "~/components/PageLayout";

export default function Index() {
  const isMobile = useScreenWidth();
  const location: Location = useLocation();
  const matches = useMatches();
  console.log({ ...matches });
  // Check if we're currently on a child route
  const isChildRoute = matches.some((match) =>
    match.pathname.includes("parent/child")
  );

  return (
    <PageLayout>
      <h1>Parent Page</h1>

      {/* Conditionally render the child route inline on desktop, as full page on mobile */}
      {isMobile || !isChildRoute ? (
        <Outlet /> // Full-page view on mobile or if there's no nested route active
      ) : (
        <div className="inline-child-view">
          {/* Inline view for desktop when child route is active */}
          <Outlet />
        </div>
      )}
    </PageLayout>
  );
}
