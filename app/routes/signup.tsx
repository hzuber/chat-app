import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { createUser, getUsers } from "~/utils/api/users";
import { registerUser } from "~/utils/api/auth";
import { CreateUser } from "types";
import { FindUser } from "~/contexts/UserContext";
import { PageLayout } from "~/components/PageLayout";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [validate, setValidate] = useState("");
  const [icon, setIcon] = useState("");
  const [message, setMessage] = useState("");
  const { login, user } = FindUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const validatePassword = password === validate;

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // const newUser: CreateUser = {
    //   username,
    //   email,
    //   password,
    //   icon,
    // };

    if (!validatePassword) {
      setMessage("Passwords don't match");
      return;
    } else {
      try {
        const { user, token } = await registerUser(username, email, password);
        // const response = await createUser(newUser);
        const users = await getUsers();
        login(user, token);
        console.log(user, token, users);
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/"); // Redirect to login page after signup
        }, 2000);
      } catch (err) {
        // setMessage(error.response?.data?.message || "Signup failed");
        console.log(err);
      }
    }
  };

  return (
    <PageLayout>
      <h2>Signup</h2>
      <form onSubmit={handleSignup}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            name="username"
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            name="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="validate">Retype Password:</label>
          <input
            name="validate"
            type="password"
            value={validate}
            onChange={(e) => setValidate(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      {message && <p>{message}</p>}
    </PageLayout>
  );
};

export default Signup;
