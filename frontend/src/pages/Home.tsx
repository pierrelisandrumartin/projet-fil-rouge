import { useEffect, useState } from "react";
import {
  ApiError,
  getMyLibrary,
  getTrending,
  importWork,
  searchWorks,
} from "../services/api";
import type { LibraryItem, WorkSearchResult } from "../types/api";
import TopBar from "../components/TopBar";
import Cover from "../components/ui/Cover";
import Chip from "../components/ui/Chip";
import Progress from "../components/ui/Progress";
import { Icon } from "../components/ui/Icon";
import WorkDetailModal from "../components/WorkDetailModal";

const CATEGORIES = [
  { id: "all", label: "All" },
  { id: "Manga", label: "Manga" },
  { id: "Manhwa", label: "Manhwa" },
  { id: "Manhua", label: "Manhua" },
  { id: "Light Novel", label: "Light Novel" },
  { id: "One-shot", label: "One-shot" },
];

interface HomeProps {
  onOpenDrawer?: () => void;
}

function Home({ onOpenDrawer }: HomeProps) {
  // Search state
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<WorkSearchResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);

  // Trending state
  const [trending, setTrending] = useState<WorkSearchResult[]>([]);
  const [trendingLoading, setTrendingLoading] = useState(true);
  const [serviceUnavailable, setServiceUnavailable] = useState(false);

  // Continue reading state
  const [continueReading, setContinueReading] = useState<LibraryItem[]>([]);

  // Library sync (importedIds + continue reading)
  const [importedIds, setImportedIds] = useState<Set<number>>(new Set());
  const [importingId, setImportingId] = useState<number | null>(null);

  // Filter
  const [activeCategory, setActiveCategory] = useState("all");
  const [selectedWork, setSelectedWork] = useState<WorkSearchResult | null>(
    null,
  );

  // Load trending and library on mount
  useEffect(() => {
    let cancelled = false;

    async function loadInitial() {
      try {
        const [trendingData, library] = await Promise.all([
          getTrending(),
          getMyLibrary(),
        ]);
        if (cancelled) return;

        setTrending(trendingData);

        const reading = library.filter(
          (item) => item.currentVolume > 0 || item.currentChapter > 0,
        );
        setContinueReading(reading);

        const jikanIds = library
          .filter((item) => item.source === "jikan" && item.externalId !== null)
          .map((item) => item.externalId as number);
        setImportedIds(new Set(jikanIds));
      } catch (err) {
        console.error("Failed to load home data:", err);
        if (!cancelled && err instanceof ApiError && err.status === 503) {
          setServiceUnavailable(true);
        }
      } finally {
        if (!cancelled) setTrendingLoading(false);
      }
    }

    loadInitial();
    return () => {
      cancelled = true;
    };
  }, []);

  async function handleSearchSubmit() {
    const query = searchQuery.trim();
    if (!query) {
      setHasSearched(false);
      setSearchResults([]);
      return;
    }

    setSearching(true);
    setSearchError(null);
    setHasSearched(true);
    try {
      const data = await searchWorks(query);
      setSearchResults(data);
    } catch (err) {
      console.error("Search failed:", err);
      if (err instanceof ApiError && err.status === 503) {
        setServiceUnavailable(true);
        setSearchError(
          "The manga service is temporarily unavailable. Please try again later.",
        );
      } else {
        setSearchError("Search failed. Please retry.");
      }
      setSearchResults([]);
    } finally {
      setSearching(false);
    }
  }

  async function handleImport(work: WorkSearchResult) {
    if (work.source !== "jikan" || work.externalId === null) return;
    setImportingId(work.externalId);
    try {
      await importWork(work.externalId, work.source);
      setImportedIds((prev) => new Set(prev).add(work.externalId!));
    } catch (err) {
      console.error("Import failed:", err);
      alert("Import failed. Please retry.");
    } finally {
      setImportingId(null);
    }
  }

  // Apply category filter
  function applyFilter(works: WorkSearchResult[]): WorkSearchResult[] {
    if (activeCategory === "all") return works;
    return works.filter((w) => w.type === activeCategory);
  }

  // Decide what to show in main grid
  const isSearchMode = hasSearched && searchQuery.trim().length > 0;
  const gridSource = isSearchMode ? searchResults : trending;
  const filteredGrid = applyFilter(gridSource);

  return (
    <div className="text-white">
      <TopBar
        onOpenDrawer={onOpenDrawer}
        subtitle={isSearchMode ? "Search results" : "Discover"}
        title={isSearchMode ? `"${searchQuery}"` : "Find your next read"}
        query={searchQuery}
        onQueryChange={setSearchQuery}
        onSearchSubmit={handleSearchSubmit}
        showSearch
      />

      {serviceUnavailable && (
        <div
          className="mt-4 p-4 rounded-2xl flex items-start gap-3"
          style={{
            background: "color-mix(in oklch, #F59E0B 12%, var(--surface))",
            border: "1px solid color-mix(in oklch, #F59E0B 40%, transparent)",
          }}
          role="alert"
        >
          <span className="text-xl shrink-0" aria-hidden="true">
            ⚠️
          </span>
          <div className="flex-1 min-w-0">
            <div className="font-medium text-white text-[14px]">
              Manga source temporarily unavailable
            </div>
            <div
              className="text-[13px] mt-0.5"
              style={{ color: "var(--text-dim)" }}
            >
              Our data provider is having issues. Trending and search are
              unavailable — your library still works. Try again in a few
              minutes.
            </div>
          </div>
        </div>
      )}

      {/* Continue reading — visible only when not searching and there are items */}
      {!isSearchMode && continueReading.length > 0 && (
        <section className="mt-6 md:mt-8">
          <SectionHeading
            kicker="Pick back up"
            title="Continue reading"
            count={continueReading.length}
          />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 md:gap-4 mt-4">
            {continueReading.slice(0, 2).map((item) => (
              <ContinueCard key={item.progressId} item={item} />
            ))}
          </div>
        </section>
      )}

      {/* Category chips */}
      <section className="mt-8 md:mt-10">
        <SectionHeading
          kicker={
            isSearchMode
              ? `${searchResults.length} result${searchResults.length === 1 ? "" : "s"}`
              : "Trending now"
          }
          title={isSearchMode ? "Search results" : "Popular this season"}
        />

        <div className="mt-4 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-1 md:flex-wrap">
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                active={activeCategory === cat.id}
                onClick={() => setActiveCategory(cat.id)}
              >
                {cat.label}
              </Chip>
            ))}
          </div>
        </div>

        {/* Loading state */}
        {(trendingLoading && !isSearchMode) || searching ? (
          <p className="mt-6 text-center" style={{ color: "var(--text-mute)" }}>
            Loading...
          </p>
        ) : searchError ? (
          <p className="mt-6 text-center text-red-400" role="alert">
            {searchError}
          </p>
        ) : filteredGrid.length === 0 ? (
          <EmptyState
            title={
              isSearchMode
                ? "No results"
                : activeCategory !== "all"
                  ? `No ${activeCategory} works`
                  : "Nothing to show"
            }
            body={
              isSearchMode
                ? `No results for "${searchQuery}". Try other keywords.`
                : "Try a different category."
            }
          />
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mt-6 md:mt-8">
            {filteredGrid.map((work) => {
              const isJikan = work.source === "jikan" && work.externalId !== null;
              const isImporting = isJikan && importingId === work.externalId;
              const isImported = isJikan && importedIds.has(work.externalId!);

              return (
                <article
                  key={`${work.source}-${work.externalId ?? work.externalIdStr}`}
                  className="flex flex-col group"
                >
                  <button
                    type="button"
                    onClick={() => setSelectedWork(work)}
                    className="relative block w-full text-left cursor-pointer"
                    style={{
                      borderRadius: "var(--radius-card)",
                      overflow: "hidden",
                    }}
                  >
                    <Cover
                      src={work.coverUrl}
                      title={work.title}
                      type={work.type}
                    />
                    <div
                      className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                      style={{
                        background:
                          "linear-gradient(to top, rgba(0,0,0,.65), rgba(0,0,0,.2) 60%, transparent)",
                      }}
                    />
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        if (isJikan && !isImported && !isImporting)
                          handleImport(work);
                      }}
                      role="button"
                      tabIndex={0}
                      aria-label={
                        !isJikan
                          ? "MangaDex import coming soon"
                          : isImported
                            ? "Already added"
                            : "Add to list"
                      }
                      title={
                        !isJikan ? "MangaDex import coming soon" : undefined
                      }
                      className={`absolute right-3 bottom-3 inline-flex items-center justify-center rounded-full w-11 h-11
                                 transition-all duration-200 active:scale-95 hover:scale-[1.05]
                                 opacity-0 translate-y-1 group-hover:opacity-100 group-hover:translate-y-0
                                 ${!isJikan || isImported || isImporting ? "opacity-50 cursor-default" : "cursor-pointer"}`}
                      style={
                        !isJikan || isImported
                          ? {
                              background: "var(--surface-2)",
                              border: "1px solid var(--border)",
                              color: "var(--text-dim)",
                            }
                          : {
                              background: "var(--accent)",
                              color: "white",
                              boxShadow:
                                "0 4px 14px -4px color-mix(in oklch, var(--accent) 50%, transparent)",
                            }
                      }
                    >
                      {!isJikan ? (
                        <Icon.Lock />
                      ) : isImported ? (
                        <Icon.Check />
                      ) : (
                        <Icon.Plus />
                      )}
                    </span>
                  </button>

                  <div className="px-0.5 mt-3 space-y-1">
                    <h3
                      className="text-[14px] font-medium text-white leading-snug line-clamp-1"
                      title={work.title}
                    >
                      {work.title}
                    </h3>
                    <div
                      className="flex items-center gap-1.5 text-[11px]"
                      style={{ color: "var(--text-mute)" }}
                    >
                      <span className="font-mono uppercase tracking-wider">
                        {work.type}
                      </span>
                      {work.status && (
                        <>
                          <span>·</span>
                          <span className="truncate">{work.status}</span>
                        </>
                      )}
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      <WorkDetailModal
        open={selectedWork !== null}
        onClose={() => setSelectedWork(null)}
        detail={
          selectedWork
            ? {
                kind: "search",
                work: selectedWork,
                inLibrary:
                  selectedWork.source === "jikan" &&
                  selectedWork.externalId !== null &&
                  importedIds.has(selectedWork.externalId),
                onAdd: () => handleImport(selectedWork),
                adding:
                  selectedWork.source === "jikan" &&
                  importingId === selectedWork.externalId,
              }
            : null
        }
      />
    </div>
  );
}

// ── ContinueCard (horizontal card for items in progress) ────────────────────
function ContinueCard({ item }: { item: LibraryItem }) {
  const totalChap = item.totalChapters > 0 ? item.totalChapters : null;

  return (
    <div
      className="group relative flex gap-4 p-3 md:p-4 rounded-2xl cursor-pointer transition-all duration-300"
      style={{
        background: "var(--surface)",
        border: "1px solid var(--border)",
      }}
      onMouseEnter={(e) =>
        (e.currentTarget.style.background = "var(--surface-2)")
      }
      onMouseLeave={(e) =>
        (e.currentTarget.style.background = "var(--surface)")
      }
    >
      <div className="w-[72px] md:w-[88px] shrink-0 rounded-lg overflow-hidden">
        <Cover
          src={item.coverUrl}
          title={item.title}
          type={item.type}
          showTypeBadge={false}
        />
      </div>
      <div className="flex-1 min-w-0 flex flex-col justify-between py-0.5">
        <div>
          <div
            className="text-[10px] font-mono uppercase tracking-[.16em] mb-1"
            style={{ color: "var(--text-mute)" }}
          >
            {item.type}
          </div>
          <h3 className="font-serif text-[18px] md:text-[20px] leading-tight text-white line-clamp-1">
            {item.title}
          </h3>
        </div>
        <div className="mt-2">
          <Progress
            value={item.currentChapter}
            total={item.totalChapters || 1}
            size="sm"
          />
          <div
            className="flex items-center justify-between mt-1.5 text-[11px] font-mono tabular-nums"
            style={{ color: "var(--text-dim)" }}
          >
            <span>
              Chapter {item.currentChapter} / {totalChap ?? "?"}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── SectionHeading ──────────────────────────────────────────────────────────
function SectionHeading({
  kicker,
  title,
  count,
}: {
  kicker?: string;
  title: string;
  count?: number;
}) {
  return (
    <div className="flex items-end justify-between gap-4">
      <div>
        {kicker && (
          <div
            className="text-[10px] uppercase tracking-[.18em] font-mono"
            style={{ color: "var(--text-mute)" }}
          >
            {kicker}
          </div>
        )}
        <h2 className="font-serif text-[24px] md:text-[28px] leading-tight tracking-tight text-white mt-1">
          {title}
        </h2>
      </div>
      {count !== undefined && (
        <div
          className="hidden md:flex items-center gap-1.5 text-[12px] font-mono"
          style={{ color: "var(--text-mute)" }}
        >
          <span className="tabular-nums">{count}</span>
        </div>
      )}
    </div>
  );
}

// ── EmptyState ──────────────────────────────────────────────────────────────
function EmptyState({ title, body }: { title: string; body: string }) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center py-16 px-6 rounded-2xl mt-6"
      style={{
        background: "var(--surface)",
        border: "1px dashed var(--border)",
      }}
    >
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl mb-4"
        style={{
          background:
            "color-mix(in oklch, var(--accent) 12%, var(--surface-2))",
          color: "var(--accent)",
        }}
      >
        <Icon.Inbox />
      </div>
      <h3 className="font-serif text-[22px] text-white">{title}</h3>
      <p
        className="mt-2 text-[14px] max-w-sm"
        style={{ color: "var(--text-dim)" }}
      >
        {body}
      </p>
    </div>
  );
}

export default Home;
