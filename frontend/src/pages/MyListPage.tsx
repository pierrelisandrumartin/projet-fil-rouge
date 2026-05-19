import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getMyLibrary, updateProgress } from "../services/api";
import type { LibraryItem } from "../types/api";

function MyListPage() {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());

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

  async function changeField(
    item: LibraryItem,
    field: "currentVolume" | "currentChapter",
    delta: number,
  ) {
    const newValue = Math.max(0, item[field] + delta);
    if (newValue === item[field]) return;

    // Optimistic update
    setItems((prev) =>
      prev.map((i) =>
        i.progressId === item.progressId ? { ...i, [field]: newValue } : i,
      ),
    );

    setUpdatingIds((prev) => new Set(prev).add(item.progressId));

    try {
      const payload =
        field === "currentVolume"
          ? { currentVolume: newValue, currentChapter: item.currentChapter }
          : { currentVolume: item.currentVolume, currentChapter: newValue };

      await updateProgress(
        item.progressId,
        payload.currentVolume,
        payload.currentChapter,
      );
    } catch (err) {
      console.error("Update failed:", err);
      // Rollback
      setItems((prev) =>
        prev.map((i) =>
          i.progressId === item.progressId ? { ...i, [field]: item[field] } : i,
        ),
      );
      alert("La mise à jour a échoué. Réessaie.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.progressId);
        return next;
      });
    }
  }

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
            const totalChap =
              item.totalChapters > 0 ? item.totalChapters : null;
            const isUpdating = updatingIds.has(item.progressId);

            const volMaxed =
              totalVol !== null && item.currentVolume >= totalVol;
            const chapMaxed =
              totalChap !== null && item.currentChapter >= totalChap;

            return (
              <article key={item.progressId} className="flex flex-col">
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
                <p
                  className="text-sm font-medium truncate mb-2"
                  title={item.title}
                >
                  {item.title}
                </p>

                {/* Volume */}
                <div className="flex items-center justify-between text-xs text-[#9A9AB0] mb-1">
                  <span>
                    Tome {item.currentVolume} / {totalVol ?? "?"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => changeField(item, "currentVolume", -1)}
                      disabled={isUpdating || item.currentVolume === 0}
                      aria-label="Decrement volume"
                      className="w-5 h-5 flex items-center justify-center bg-[#252836] rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#7C5CBF] transition-colors"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => changeField(item, "currentVolume", +1)}
                      disabled={isUpdating || volMaxed}
                      aria-label="Increment volume"
                      className="w-5 h-5 flex items-center justify-center bg-[#252836] rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#7C5CBF] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Chapitre */}
                <div className="flex items-center justify-between text-xs text-[#9A9AB0]">
                  <span>
                    Chap. {item.currentChapter} / {totalChap ?? "?"}
                  </span>
                  <div className="flex gap-1">
                    <button
                      type="button"
                      onClick={() => changeField(item, "currentChapter", -1)}
                      disabled={isUpdating || item.currentChapter === 0}
                      aria-label="Decrement chapter"
                      className="w-5 h-5 flex items-center justify-center bg-[#252836] rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#7C5CBF] transition-colors"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => changeField(item, "currentChapter", +1)}
                      disabled={isUpdating || chapMaxed}
                      aria-label="Increment chapter"
                      className="w-5 h-5 flex items-center justify-center bg-[#252836] rounded text-white disabled:opacity-30 disabled:cursor-not-allowed hover:bg-[#7C5CBF] transition-colors"
                    >
                      +
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default MyListPage;
