import { createContext, useContext, ReactNode } from "react";
import { User } from "../../types";

interface UserContextType {
  user: User;
  isLoading: boolean;
}

interface Props {
  children: ReactNode;
}

const UserContext = createContext<UserContextType | undefined | null>(
  undefined
);

export const UserProvider = ({ children }: Props) => {
  //pw = iamhannah
  const user: User = {
    id: "123",
    username: "Hannah",
    email: "hannah@hannah.com",
    password: "$2a$12$kOp.nqBG2GPwfDwGSkHfPOUdGQkVhpP.lyqjnnW4JsI0drhW.IeGq",
    icon: null,
  };
  const isLoading = false;

  return (
    <UserContext.Provider value={{ user, isLoading }}>
      {children}
    </UserContext.Provider>
  );
};

export function FindUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("findUser must be used within a UserProvider");
  }
  return { user: context.user, isLoading: context.isLoading };
}
