import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await login({ email, password });
      navigate("/");
    } catch (err) {
      console.error("Login failed:", err);
      setError("Email or password is incorrect");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      kicker="Welcome back"
      title="Pick up where the last chapter left you."
      body="Your reading list, progression, and notes — synced quietly across all your devices."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <div
            className="text-[10px] uppercase tracking-[.24em] font-mono"
            style={{ color: "var(--text-mute)" }}
          >
            Sign in
          </div>
          <h1 className="mt-2 font-serif text-[36px] leading-tight tracking-tight text-white">
            Welcome back.
          </h1>
          <p
            className="mt-2 text-[14px]"
            style={{ color: "var(--text-dim)" }}
          >
            New to Yomi?{" "}
            <Link
              to="/register"
              className="underline underline-offset-2"
              style={{ color: "var(--accent)" }}
            >
              Create an account
            </Link>
          </p>
        </div>

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          icon={<Icon.Mail />}
          placeholder="you@example.com"
          autoFocus
          required
        />

        <Field
          label="Password"
          type="password"
          value={password}
          onChange={setPassword}
          icon={<Icon.Lock />}
          placeholder="••••••••"
          required
        />

        {error && (
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        <Button type="submit" size="lg" disabled={loading}>
          {loading ? <Spinner /> : "Sign in"}
        </Button>
      </form>
    </AuthShell>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
  );
}

export default LoginPage;