import { useState, useEffect } from "react";
import { useNavigate } from "@remix-run/react";
import { Dropdown, Button } from "react-bootstrap";
import { FindUser } from "../../contexts/UserContext";
import { User } from "types";
import { deleteUser } from "~/utils/api/users";

export const NavBar = () => {
  const { user: theUser, isLoading: isUserLoading, logout } = FindUser();
  const [isLoading, setIsLoading] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  const deleteAccount = async () => {
    logout();
    user && (await deleteUser(user.id));
    navigate("/signup");
  };

  useEffect(() => {
    if (!isUserLoading && theUser) {
      setUser(theUser);
      setIsLoading(false);
    }
  }, [theUser, isUserLoading, user]);

  return (
    <nav className="container-fluid py-2 px-4">
      <ul className="w-100 d-flex justify-content-between align-items-center list-unstyled">
        {/* Display the username if the user is not loading */}
        <li>{!isLoading && theUser?.username}</li>

        {/* Dropdown button */}
        <Dropdown>
          <Dropdown.Toggle variant="secondary" id="dropdown-basic">
            Account
          </Dropdown.Toggle>

          <Dropdown.Menu>
            <Dropdown.Item onClick={() => logout()}>Logout</Dropdown.Item>
            <Dropdown.Item onClick={() => deleteAccount()}>
              Delete Account
            </Dropdown.Item>
          </Dropdown.Menu>
        </Dropdown>
      </ul>
    </nav>
  );
};
