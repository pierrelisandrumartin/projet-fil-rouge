function Navbar() {
  return (
    <nav className="fixed top-0 left-0 h-screen w-60 bg-[#1A1D27] flex flex-col justify-between px-4 py-6">

      {/* Logo */}
      <div>
        <h1 className="text-white text-xl font-bold mb-8">AppName</h1>

        {/* Nav links */}
        <ul className="flex flex-col gap-2">
          <li>
            <a href="/" aria-current="page" className="flex items-center gap-3 text-white bg-[#7C5CBF] px-4 py-2 rounded-lg">
              <span aria-hidden="true">🏠</span> Home
            </a>
          </li>
          <li>
            <a href="/catalog" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              <span aria-hidden="true">📚</span> Catalog
            </a>
          </li>
          <li>
            <a href="/mylist" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              <span aria-hidden="true">🔖</span> My List
            </a>
          </li>
          <li>
            <a href="/profile" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              <span aria-hidden="true">👤</span> Profile
            </a>
          </li>
        </ul>
      </div>

      {/* User section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-sm" aria-hidden="true">
          K
        </div>
        <div>
          <p className="text-white text-sm font-medium">Username</p>
          <button
            type="button"
            className="text-[#9A9AB0] text-xs hover:text-white transition-colors cursor-pointer bg-transparent border-none p-0"
          >
            Logout
          </button>
        </div>
      </div>

    </nav>
  )
}

export default Navbar
