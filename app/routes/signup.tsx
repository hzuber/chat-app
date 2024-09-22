import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getUsers } from "~/utils/api/users";
import { registerUser } from "~/utils/api/auth";
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

    if (!validatePassword) {
      setMessage("Passwords don't match");
      return;
    } else {
      try {
        const { user, token } = await registerUser(username, email, password);
        login(user, token);
        setMessage("Signup successful! Redirecting to login...");
        setTimeout(() => {
          navigate("/");
        }, 2000);
      } catch (err) {
        console.log(err);
      }
    }
  };

  return (
    <PageLayout>
      <div className="card mt-5 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h2 className="card-title mb-4 text-center">Signup</h2>

          {/* Display success or error message */}
          {message && <div className="alert alert-info">{message}</div>}

          <form onSubmit={handleSignup}>
            <div className="form-group mb-3">
              <label htmlFor="username">Username</label>
              <input
                name="username"
                type="text"
                className="form-control"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                name="email"
                type="email"
                className="form-control"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="password">Password</label>
              <input
                name="password"
                type="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group mb-3">
              <label htmlFor="validate">Retype Password</label>
              <input
                name="validate"
                type="password"
                className="form-control"
                placeholder="Re-enter your password"
                value={validate}
                onChange={(e) => setValidate(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Sign Up
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="text-center mt-3">
        Already have an account? <a href="/login">Login</a>
      </p>
    </PageLayout>
  );
};

export default Signup;
