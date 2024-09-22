import { Outlet, useMatches, useLocation } from "@remix-run/react";
import useScreenWidth from "~/utils/hooks/useScreenWidth";
import { PageLayout } from "~/components/PageLayout";
import { useNavigate } from "@remix-run/react";
import { useEffect } from "react";

export default function Index() {
  const navigate = useNavigate();

  useEffect(() => {
    navigate("/chat");
  });

  return (
    <PageLayout>
      <p>**should not be seen, take care of a redirect**</p>
    </PageLayout>
  );
}
