import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { searchWorks, importWork, getMyLibrary } from "../services/api";
import type { WorkSearchResult } from "../types/api";

const CATEGORIES = ["All", "Manga", "Webtoon", "Manhwa", "Light Novel", "Comics", "BD"];

function Home() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [results, setResults] = useState<WorkSearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  const [importingId, setImportingId] = useState<number | null>(null);
  const [importedIds, setImportedIds] = useState<Set<number>>(new Set());

    useEffect(() => {
  let cancelled = false;

  async function preloadLibrary() {
    try {
      const library = await getMyLibrary();
      if (cancelled) return;

      const jikanIds = library
        .filter((item) => item.source === "jikan" && item.externalId !== null)
        .map((item) => item.externalId as number);

      setImportedIds(new Set(jikanIds));
    } catch (err) {
      console.error("Failed to preload library:", err);
      // On échoue silencieusement : la page reste utilisable
    }
  }

  preloadLibrary();
  return () => {
    cancelled = true;
  };
}, []);

  async function handleSearch(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    setLoading(true);
    setError(null);
    setHasSearched(true);
    try {
      const data = await searchWorks(query);
      setResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      setError("La recherche a échoué. Réessaie.");
      setResults([]);
    } finally {
      setLoading(false);
    }
  }

  async function handleImport(work: WorkSearchResult) {
    setImportingId(work.externalId);
    try {
      await importWork(work.externalId, work.source);
      setImportedIds((prev) => new Set(prev).add(work.externalId));
    } catch (err) {
      console.error("Import failed:", err);
      alert("L'import a échoué. Réessaie.");
    } finally {
      setImportingId(null);
    }
  }

  return (
    <div className="text-white">
      <form onSubmit={handleSearch} className="flex justify-center mb-8">
        <div className="flex items-center bg-[#1A1D27] rounded-full px-4 py-2 w-full max-w-xl">
          <button
            type="submit"
            aria-label="Search"
            className="text-[#9A9AB0] mr-2 bg-transparent border-none cursor-pointer"
          >
            🔍
          </button>
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
      </form>

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

      {loading && <p className="text-[#9A9AB0] text-center">Recherche en cours...</p>}

      {error && <p className="text-red-400 text-center" role="alert">{error}</p>}

      {hasSearched && !loading && !error && (
        <section className="mb-10" aria-labelledby="results-title">
          <div className="flex justify-between items-center mb-4">
            <h2 id="results-title" className="text-lg font-bold">
              Résultats pour « {searchQuery} » ({results.length})
            </h2>
          </div>
          {results.length === 0 ? (
            <p className="text-[#9A9AB0]">Aucun résultat.</p>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {results.map((work) => {
                const isImporting = importingId === work.externalId;
                const isImported = importedIds.has(work.externalId);

                return (
                  <article key={`${work.source}-${work.externalId}`} className="flex flex-col">
                    {work.coverUrl ? (
                      <img
                        src={work.coverUrl}
                        alt={`${work.title} cover`}
                        className="w-full h-56 object-cover rounded-lg mb-2"
                      />
                    ) : (
                      <div className="w-full h-56 bg-[#1A1D27] rounded-lg flex items-center justify-center text-[#9A9AB0] text-xs mb-2">
                        No cover
                      </div>
                    )}
                    <span className="text-xs bg-[#7C5CBF] self-start px-2 py-0.5 rounded text-white mb-1">
                      {work.type}
                    </span>
                    <p className="text-sm font-medium truncate mb-1" title={work.title}>
                      {work.title}
                    </p>
                    <p className="text-xs text-[#9A9AB0] mb-2">
                      {work.volumes ? `${work.volumes} tomes` : work.status}
                    </p>

                    <button
                      type="button"
                      onClick={() => handleImport(work)}
                      disabled={isImporting || isImported}
                      className={`text-xs py-1 rounded-full font-medium transition-colors
                        ${isImported
                          ? "bg-[#252836] text-[#9A9AB0] cursor-default"
                          : isImporting
                          ? "bg-[#7C5CBF] text-white opacity-50 cursor-wait"
                          : "bg-[#7C5CBF] text-white hover:bg-[#6a4dab] cursor-pointer"
                        }`}
                    >
                      {isImported ? "✓ Ajouté" : isImporting ? "..." : "+ Ajouter"}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default Home;