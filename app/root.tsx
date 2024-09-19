import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "@remix-run/react";
import { NavBar } from "./components/NavBar/NavBar";
import Footer from "./components/Footer/Footer";
import "./root.scss";
import "bootstrap/dist/css/bootstrap.min.css";
import { SocketProvider } from "~/contexts/SocketContext";
import { UserProvider } from "~/contexts/UserContext";

export function Layout({ children }: { children: React.ReactNode }) {
  console.log("layout loads");
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

export default function App() {
  console.log("app loads");
  return (
    <SocketProvider>
      <UserProvider>
        <div className="layout_container justify-content-between d-flex flex-column w-100">
          <NavBar />
          <div className="layout_container--inner">
            <Outlet />
          </div>
          <Footer />
        </div>
      </UserProvider>
    </SocketProvider>
  );
}
