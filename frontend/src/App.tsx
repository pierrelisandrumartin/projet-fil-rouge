import Navbar from "./components/Navbar";
import Home from "./pages/Home";
function App() {
  return (
    <div className="flex bg-[#0F1117] min-h-screen">
      <Navbar />
      <main className="ml-60 flex-1 p-8">
        <Home />
      </main>
    </div>
  );
}

export default App;
