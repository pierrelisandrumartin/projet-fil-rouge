import { useState } from "react";

const CATEGORIES = ["All", "Manga", "Webtoon", "Manhwa", "Light Novel", "Comics", "BD"];

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");

  return (
    <div className="text-white">

      {/* Barre de recherche */}
      <div className="flex justify-center mb-8">
        <div className="flex items-center bg-[#1A1D27] rounded-full px-4 py-2 w-full max-w-xl">
          <span aria-hidden="true" className="text-[#9A9AB0] mr-2">🔍</span>
          <input
            type="search"
            id="site-search"
            name="q"
            aria-label="Search a title or author"
            placeholder="Search a title, author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="bg-transparent outline-none text-white w-full placeholder-[#9A9AB0]"
          />
        </div>
      </div>

      {/* Chips catégories */}
      <ul className="flex gap-2 mb-10 flex-wrap" role="list" aria-label="Filter by category">
        {CATEGORIES.map((cat) => (
          <li key={cat}>
            <button
              type="button"
              onClick={() => setActiveCategory(cat)}
              aria-pressed={activeCategory === cat}
              className={`px-4 py-1 rounded-full text-sm border transition-colors
                ${activeCategory === cat
                  ? "bg-[#7C5CBF] text-white border-[#7C5CBF]"
                  : "text-[#9A9AB0] border-[#9A9AB0] hover:text-white hover:border-white"
                }`}
            >
              {cat}
            </button>
          </li>
        ))}
      </ul>

      {/* Section Trending */}
      <section className="mb-10" aria-labelledby="trending-title">
        <div className="flex justify-between items-center mb-4">
          <h2 id="trending-title" className="text-lg font-bold">Trending</h2>
          <a href="/catalog" className="text-[#9A9AB0] text-sm hover:text-white">See all →</a>
        </div>
        <div className="flex gap-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex flex-col w-40 shrink-0">
              <div className="w-40 h-56 bg-[#1A1D27] rounded-lg flex items-center justify-center text-[#9A9AB0] text-xs mb-2">
                Cover {i}
              </div>
              <span className="text-xs bg-[#7C5CBF] self-start px-2 py-0.5 rounded text-white mb-1">Manga</span>
              <p className="text-sm font-medium truncate">Titre de l'œuvre</p>
              <p className="text-xs text-[#9A9AB0]">24 tomes</p>
            </div>
          ))}
        </div>
      </section>

      {/* Section Recently Added */}
      <section aria-labelledby="recent-title">
        <div className="flex justify-between items-center mb-4">
          <h2 id="recent-title" className="text-lg font-bold">Recently Added</h2>
          <a href="/catalog" className="text-[#9A9AB0] text-sm hover:text-white">See all →</a>
        </div>
        <div className="flex flex-col gap-3">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="flex items-center gap-4 bg-[#1A1D27] rounded-lg p-3">
              <div className="w-12 h-16 bg-[#252836] rounded shrink-0 flex items-center justify-center text-[#9A9AB0] text-xs">
                img
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm mb-1">Titre de l'œuvre</p>
                <span className="text-xs bg-[#252836] px-2 py-0.5 rounded text-[#9A9AB0] mb-2 inline-block">Manga</span>
                <p className="text-xs text-[#9A9AB0] line-clamp-2">Synopsis court de l'œuvre affiché sur deux lignes maximum pour garder la lisibilité.</p>
              </div>
              <div className="shrink-0 w-32">
                <p className="text-xs text-[#9A9AB0] mb-1">tome 4 / 24</p>
                <div className="w-full h-1.5 bg-[#252836] rounded-full" role="progressbar" aria-valuenow={33} aria-valuemin={0} aria-valuemax={100} aria-label="Reading progress">
                  <div className="h-1.5 bg-[#7C5CBF] rounded-full" style={{ width: "33%" }}></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}

export default Home
