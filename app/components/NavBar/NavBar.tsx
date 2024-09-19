import { useState, useEffect } from "react";
import { FindUser } from "../../contexts/UserContext";
import { User } from "types";

export const NavBar = () => {
  const { user: theUser, isLoading: isUserLoading } = FindUser();
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    if (!isUserLoading) {
      setUser(theUser);
      setIsLoading(false);
    }
  }, [theUser, isUserLoading]);

  return (
    <nav className="container-fluid py-2 px-4">
      <ul className="w-100 d-flex justify-content-between align-items-center list-unstyled">
        <li>Logo</li>
        <li>{!isLoading && user?.username}</li>
      </ul>
    </nav>
  );
};
