import type { LinksFunction } from "@remix-run/node";
import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { SocketProvider } from "~/contexts/SocketContext";
import { UserProvider } from "~/contexts/UserContext";
import { Suspense } from "react";

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: "/app/root.css" },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.1.3/css/bootstrap.min.css",
  },
  {
    rel: "stylesheet",
    href: "https://cdnjs.cloudflare.com/ajax/libs/bootstrap-icons/1.8.1/font/bootstrap-icons.min.css",
  },
];

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

const Loading = () => {
  return <p> loading </p>;
};

export default function App() {
  return (
    <Suspense fallback={<Loading />}>
      <SocketProvider>
        <UserProvider>
          <Outlet />
        </UserProvider>
      </SocketProvider>
    </Suspense>
  );
}
