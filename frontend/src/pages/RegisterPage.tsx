import { useState } from "react";
import type { FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import AuthShell from "../components/AuthShell";
import Field from "../components/ui/Field";
import Button from "../components/ui/Button";
import { Icon } from "../components/ui/Icon";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const passStrength = Math.min(4, Math.floor(password.length / 3));
  const strengthLabel = ["too short", "weak", "okay", "good", "strong"][
    passStrength
  ];

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/");
    } catch (err) {
      console.error("Register failed:", err);
      setError("Sign up failed. The email may already be in use.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthShell
      kicker="Get started"
      title="Build the shelf that knows your reading."
      body="Catalog series, mark chapters read, track your progress. Yomi keeps everything tidy so you don't have to."
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <div
            className="text-[10px] uppercase tracking-[.24em] font-mono"
            style={{ color: "var(--text-mute)" }}
          >
            Create account
          </div>
          <h1 className="mt-2 font-serif text-[36px] leading-tight tracking-tight text-white">
            Start your shelf.
          </h1>
          <p className="mt-2 text-[14px]" style={{ color: "var(--text-dim)" }}>
            Already have one?{" "}
            <Link
              to="/login"
              className="underline underline-offset-2"
              style={{ color: "var(--accent)" }}
            >
              Sign in
            </Link>
          </p>
        </div>

        <Field
          label="Display name"
          value={username}
          onChange={setUsername}
          icon={<Icon.User />}
          placeholder="How others see you"
          autoFocus
          required
          minLength={3}
        />

        <Field
          label="Email"
          type="email"
          value={email}
          onChange={setEmail}
          icon={<Icon.Mail />}
          placeholder="you@example.com"
          required
        />

        <div>
          <Field
            label="Password"
            type="password"
            value={password}
            onChange={setPassword}
            icon={<Icon.Lock />}
            placeholder="At least 6 characters"
            required
            minLength={6}
            hint={
              password.length > 0 && (
                <span
                  style={{
                    color:
                      passStrength >= 3 ? "var(--accent)" : "var(--text-mute)",
                  }}
                >
                  {strengthLabel}
                </span>
              )
            }
          />

          {/* Password strength indicator */}
          {password.length > 0 && (
            <div className="mt-2 grid grid-cols-4 gap-1">
              {[0, 1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="h-1 rounded-full transition-colors duration-200"
                  style={{
                    background:
                      i < passStrength
                        ? passStrength >= 3
                          ? "var(--accent)"
                          : "#F59E0B"
                        : "var(--surface-2)",
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {error && (
          <p className="text-red-400 text-sm" role="alert">
            {error}
          </p>
        )}

        <Button
          type="submit"
          size="lg"
          disabled={loading || !username || !email || password.length < 6}
        >
          {loading ? <Spinner /> : "Create account"}
        </Button>

        <p
          className="text-[11px] text-center"
          style={{ color: "var(--text-mute)" }}
        >
          By signing up, you agree to our Terms and Privacy Policy.
        </p>
      </form>
    </AuthShell>
  );
}

function Spinner() {
  return (
    <span className="inline-block w-4 h-4 rounded-full border-2 border-white/30 border-t-white animate-spin" />
  );
}

export default RegisterPage;
