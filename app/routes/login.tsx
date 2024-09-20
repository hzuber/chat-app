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
  console.log("login");

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
      <div className="card-custom mt-8">
        <form onSubmit={handleSubmit} className="flex flex-col">
          <h1 className="mb-6">Login</h1>
          {error && <p>{error}</p>}
          <input
            className="mb-3"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            className="mb-3"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="btn-custom" type="submit">
            Login
          </button>
        </form>
      </div>
      <p className="text-center mt-8">
        New here? <a href="/signup">Sign up</a>
      </p>
    </PageLayout>
  );
}
