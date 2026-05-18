import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLibrary } from "../services/api";
import type { LibraryItem } from "../types/api";

function MyListPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMyLibrary();
        if (!cancelled) setItems(data);
      } catch (err) {
        console.error("Failed to load library:", err);
        if (!cancelled) setError("Impossible de charger ta liste.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="text-white">
      <h1 className="text-2xl font-bold mb-6">Ma liste</h1>

      {loading && <p className="text-[#9A9AB0]">Chargement...</p>}

      {error && (
        <p className="text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <p className="text-[#9A9AB0]">
          Ta liste est vide. Va sur la{" "}
          <Link to="/" className="text-[#7C5CBF] hover:underline">
            page d'accueil
          </Link>{" "}
          pour ajouter des œuvres.
        </p>
      )}

      {!loading && !error && items.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {items.map((item) => {
            const totalVol = item.totalVolumes > 0 ? item.totalVolumes : null;
            const percent =
              totalVol !== null && totalVol > 0
                ? Math.round((item.currentVolume / totalVol) * 100)
                : 0;

            return (
              <article key={item.workId} className="flex flex-col">
                {item.coverUrl ? (
                  <img
                    src={item.coverUrl}
                    alt={`${item.title} cover`}
                    className="w-full h-56 object-cover rounded-lg mb-2"
                  />
                ) : (
                  <div className="w-full h-56 bg-[#1A1D27] rounded-lg flex items-center justify-center text-[#9A9AB0] text-xs mb-2">
                    No cover
                  </div>
                )}
                <span className="text-xs bg-[#7C5CBF] self-start px-2 py-0.5 rounded text-white mb-1">
                  {item.type}
                </span>
                <p className="text-sm font-medium truncate mb-1" title={item.title}>
                  {item.title}
                </p>
                <p className="text-xs text-[#9A9AB0] mb-1">
                  Tome {item.currentVolume} / {totalVol ?? "?"}
                </p>
                {totalVol !== null && (
                  <div
                    className="w-full h-1.5 bg-[#252836] rounded-full"
                    role="progressbar"
                    aria-valuenow={percent}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label={`Reading progress for ${item.title}`}
                  >
                    <div
                      className="h-1.5 bg-[#7C5CBF] rounded-full"
                      style={{ width: `${percent}%` }}
                    ></div>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyListPage;