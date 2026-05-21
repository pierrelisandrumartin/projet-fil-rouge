import { useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/Navbar";
import BottomNav from "./components/BottomNav";
import Home from "./pages/Home";
import MyListPage from "./pages/MyListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <div
      className="min-h-screen relative"
      style={{ background: "var(--bg)", color: "var(--text)" }}
    >
      <div
        className="pointer-events-none fixed top-0 right-0 w-[60vw] h-[60vh] opacity-50"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse at top right, color-mix(in oklch, var(--accent) 18%, transparent), transparent 60%)",
        }}
      />
      <div
        className="pointer-events-none fixed bottom-0 left-1/4 w-[50vw] h-[40vh] opacity-30"
        aria-hidden="true"
        style={{
          background:
            "radial-gradient(ellipse, color-mix(in oklch, var(--accent-2) 15%, transparent), transparent 60%)",
        }}
      />

      <Navbar
        drawerOpen={drawerOpen}
        onCloseDrawer={() => setDrawerOpen(false)}
      />

      <main className="md:pl-[240px] relative">
        <div className="px-4 md:px-8 pb-24 md:pb-12 max-w-[1600px] mx-auto">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/mylist" element={<MyListPage />} />
            <Route path="/profile" element={<ProfilePage />} />
          </Routes>
        </div>
      </main>

      <BottomNav />
    </div>
  );
}

export default App;
