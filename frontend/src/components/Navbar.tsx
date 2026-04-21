function Navbar() {
  return (
    <nav className="fixed top-0 left-0 h-screen w-60 bg-[#1A1D27] flex flex-col justify-between px-4 py-6">
      
      {/* Logo */}
      <div>
        <h1 className="text-white text-xl font-bold mb-8">AppName</h1>

        {/* Nav links */}
        <ul className="flex flex-col gap-2">
          <li>
            <a href="/" className="flex items-center gap-3 text-white bg-[#7C5CBF] px-4 py-2 rounded-lg">
              🏠 Home
            </a>
          </li>
          <li>
            <a href="/catalog" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              📚 Catalog
            </a>
          </li>
          <li>
            <a href="/mylist" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              🔖 My List
            </a>
          </li>
          <li>
            <a href="/profile" className="flex items-center gap-3 text-[#9A9AB0] px-4 py-2 rounded-lg hover:text-white hover:bg-[#252836] transition-colors">
              👤 Profile
            </a>
          </li>
        </ul>
      </div>

      {/* User section */}
      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-[#7C5CBF] flex items-center justify-center text-white text-sm">
          K
        </div>
        <div>
          <p className="text-white text-sm font-medium">Username</p>
          <p className="text-[#9A9AB0] text-xs">Logout</p>
        </div>
      </div>

    </nav>
  )
}

export default Navbar