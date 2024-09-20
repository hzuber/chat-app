import {
  createContext,
  useContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { useNavigate, useLocation } from "@remix-run/react";
import { validateToken } from "~/utils/api/auth";
import { User } from "../../types";

interface UserContextType {
  user: User | null;
  isLoading: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

interface Props {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: Props) => {
  //pw = iamhannah
  // const user: User = {
  //   id: "123",
  //   username: "Hannah",
  //   email: "hannah@hannah.com",
  //   password: "$2a$12$kOp.nqBG2GPwfDwGSkHfPOUdGQkVhpP.lyqjnnW4JsI0drhW.IeGq",
  //   icon: null,
  // };
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("useeffect");
    const token = localStorage.getItem("token");
    console.log("useeffect token", localStorage, token);
    if (token) {
      validateToken().then((userData) => {
        if (userData) {
          console.log("useeffect", userData);
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

  const login = (userData: User, token: string) => {
    console.log("login function", userData, token);
    setUser(userData);
    localStorage.setItem("token", token);
    navigate("/");
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

  return (
    <UserContext.Provider value={{ user, isLoading, login, logout }}>
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
