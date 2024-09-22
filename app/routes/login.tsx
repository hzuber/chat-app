import { useEffect, useState } from "react";
import { loginUser } from "../utils/api/auth";
import { FindUser } from "../contexts/UserContext";
import { useNavigate } from "@remix-run/react";
import { PageLayout } from "../components/PageLayout";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { user, login } = FindUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const { user, token } = await loginUser(email, password);
      login(user, token);
      navigate("/");
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An unknown error occurred");
      }
    }
  };

  return (
    <PageLayout>
      <div className="card mt-5 mx-auto" style={{ maxWidth: "400px" }}>
        <div className="card-body">
          <h1 className="card-title mb-4 text-center">Login</h1>

          {/* Show error message if present */}
          {error && <div className="alert alert-danger">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="form-group mb-3">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
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
                type="password"
                id="password"
                className="form-control"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <div className="d-grid">
              <button type="submit" className="btn btn-primary">
                Login
              </button>
            </div>
          </form>
        </div>
      </div>

      <p className="text-center mt-3">
        New here? <a href="/signup">Sign up</a>
      </p>
    </PageLayout>
  );
}
