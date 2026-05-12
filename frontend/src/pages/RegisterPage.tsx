import { useState } from "react";
import type { FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      await register({ username, email, password });
      navigate("/");
    } catch (e) {
      console.error("Register failed:", e);
      setError("Inscription impossible. L'email est peut-être déjà utilisé.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#0F1117] flex items-center justify-center px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-[#1A1D27] rounded-2xl p-8 w-full max-w-md"
      >
        <h1 className="text-white text-2xl font-bold mb-6">Inscription</h1>

        <label className="block text-[#9A9AB0] text-sm mb-1" htmlFor="username">
          Nom d'utilisateur
        </label>
        <input
          id="username"
          type="text"
          required
          minLength={3}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full bg-[#252836] text-white px-4 py-2 rounded-lg mb-4 outline-none"
        />

        <label className="block text-[#9A9AB0] text-sm mb-1" htmlFor="email">
          Email
        </label>
        <input
          id="email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full bg-[#252836] text-white px-4 py-2 rounded-lg mb-4 outline-none"
        />

        <label className="block text-[#9A9AB0] text-sm mb-1" htmlFor="password">
          Mot de passe
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={6}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full bg-[#252836] text-white px-4 py-2 rounded-lg mb-4 outline-none"
        />

        {error && (
          <p className="text-red-400 text-sm mb-4" role="alert">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-[#7C5CBF] text-white py-2 rounded-lg disabled:opacity-50"
        >
          {loading ? "Inscription..." : "Créer mon compte"}
        </button>

        <p className="text-[#9A9AB0] text-sm mt-4 text-center">
          Déjà inscrit ?{" "}
          <Link to="/login" className="text-[#7C5CBF] hover:underline">
            Se connecter
          </Link>
        </p>
      </form>
    </div>
  );
}

export default RegisterPage;