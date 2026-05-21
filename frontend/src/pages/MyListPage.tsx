import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  getMyLibrary,
  removeFromLibrary,
  updateProgress,
} from "../services/api";

import type { LibraryItem } from "../types/api";
import TopBar from "../components/TopBar";
import Cover from "../components/ui/Cover";
import IconButton from "../components/ui/IconButton";
import Chip from "../components/ui/Chip";
import Progress from "../components/ui/Progress";
import { Icon } from "../components/ui/Icon";
import WorkDetailModal from "../components/WorkDetailModal";

interface MyListPageProps {
  onOpenDrawer?: () => void;
}

type StatusFilter = "all" | "reading" | "completed" | "planned";

function MyListPage({ onOpenDrawer }: MyListPageProps) {
  const [items, setItems] = useState<LibraryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingIds, setUpdatingIds] = useState<Set<number>>(new Set());
  const [filter, setFilter] = useState<StatusFilter>("all");
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const data = await getMyLibrary();
        if (!cancelled) setItems(data);
      } catch (err) {
        console.error("Failed to load library", err);
        if (!cancelled) setError("Failed to load your list.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  // Sync selectedItem with items so the modal stays fresh after +/-/remove
  useEffect(() => {
    if (!selectedItem) return;
    const fresh = items.find((i) => i.progressId === selectedItem.progressId);
    if (!fresh) {
      // Item was removed — close the modal
      setSelectedItem(null);
    } else if (fresh !== selectedItem) {
      setSelectedItem(fresh);
    }
  }, [items, selectedItem]);

  async function setField(
    item: LibraryItem,
    field: "currentVolume" | "currentChapter",
    newValue: number,
  ) {
    const cap = field === "currentChapter" ? 9999 : 999;
    const clamped = Math.max(0, Math.min(cap, newValue));
    if (clamped === item[field]) return;

    setItems((prev) =>
      prev.map((i) =>
        i.progressId === item.progressId ? { ...i, [field]: clamped } : i,
      ),
    );

    setUpdatingIds((prev) => new Set(prev).add(item.progressId));

    try {
      const payload =
        field === "currentVolume"
          ? { currentVolume: clamped, currentChapter: item.currentChapter }
          : { currentVolume: item.currentVolume, currentChapter: clamped };

      await updateProgress(
        item.progressId,
        payload.currentVolume,
        payload.currentChapter,
      );
    } catch (err) {
      console.error("Update failed:", err);
      setItems((prev) =>
        prev.map((i) =>
          i.progressId === item.progressId ? { ...i, [field]: item[field] } : i,
        ),
      );
      alert("Update failed. Please retry.");
    } finally {
      setUpdatingIds((prev) => {
        const next = new Set(prev);
        next.delete(item.progressId);
        return next;
      });
    }
  }

  function changeField(
    item: LibraryItem,
    field: "currentVolume" | "currentChapter",
    delta: number,
  ) {
    setField(item, field, item[field] + delta);
  }

  async function handleRemove(item: LibraryItem) {
    const confirmed = window.confirm(`Remove "${item.title}" from your list?`);
    if (!confirmed) return;

    const snapshot = items;
    setItems((prev) => prev.filter((i) => i.progressId !== item.progressId));

    try {
      await removeFromLibrary(item.progressId);
    } catch (err) {
      console.error("Remove failed", err);
      setItems(snapshot);
      alert("Removal failed. Please retry.");
    }
  }

  function isCompleted(item: LibraryItem): boolean {
    return item.totalChapters > 0 && item.currentChapter >= item.totalChapters;
  }
  function isReading(item: LibraryItem): boolean {
    return (
      !isCompleted(item) && (item.currentChapter > 0 || item.currentVolume > 0)
    );
  }
  function isPlanned(item: LibraryItem): boolean {
    return item.currentChapter === 0 && item.currentVolume === 0;
  }

  const totals = {
    all: items.length,
    reading: items.filter(isReading).length,
    completed: items.filter(isCompleted).length,
    planned: items.filter(isPlanned).length,
  };

  const totalChapters = items.reduce((s, i) => s + i.currentChapter, 0);

  const filteredItems = items.filter((item) => {
    if (filter === "all") return true;
    if (filter === "reading") return isReading(item);
    if (filter === "completed") return isCompleted(item);
    if (filter === "planned") return isPlanned(item);
    return true;
  });

  return (
    <div className="text-white">
      <TopBar
        onOpenDrawer={onOpenDrawer}
        subtitle="Your shelf"
        title="My list"
      />

      {/* Stats strip */}
      {!loading && !error && items.length > 0 && (
        <section className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-6">
          <StatCard label="On the shelf" value={items.length} accent />
          <StatCard label="Reading now" value={totals.reading} />
          <StatCard label="Finished" value={totals.completed} />
          <StatCard label="Chapters read" value={totalChapters} mono />
        </section>
      )}

      {/* Filter chips */}
      {!loading && !error && items.length > 0 && (
        <div className="mt-8 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto scrollbar-none">
          <div className="flex gap-2 pb-1 md:flex-wrap">
            <Chip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              count={totals.all}
            >
              All
            </Chip>
            <Chip
              active={filter === "reading"}
              onClick={() => setFilter("reading")}
              count={totals.reading}
            >
              Reading
            </Chip>
            <Chip
              active={filter === "completed"}
              onClick={() => setFilter("completed")}
              count={totals.completed}
            >
              Completed
            </Chip>
            <Chip
              active={filter === "planned"}
              onClick={() => setFilter("planned")}
              count={totals.planned}
            >
              Plan to read
            </Chip>
          </div>
        </div>
      )}

      {/* Loading / Error / Empty / Grid */}
      {loading && (
        <p className="mt-6 text-center" style={{ color: "var(--text-mute)" }}>
          Loading...
        </p>
      )}

      {error && (
        <p className="mt-6 text-center text-red-400" role="alert">
          {error}
        </p>
      )}

      {!loading && !error && items.length === 0 && (
        <EmptyState
          title="Your list is empty"
          body="Go to the home page to discover and add works."
          action={
            <Link
              to="/"
              className="inline-flex items-center justify-center font-medium rounded-xl h-11 px-4 text-sm text-white"
              style={{
                background:
                  "linear-gradient(135deg, var(--accent), var(--accent-2))",
                boxShadow:
                  "0 6px 24px -8px color-mix(in oklch, var(--accent) 60%, transparent)",
              }}
            >
              Discover works
            </Link>
          }
        />
      )}

      {!loading && !error && items.length > 0 && filteredItems.length === 0 && (
        <EmptyState
          title="No works in this category"
          body="Change the filter to see the rest of your library."
        />
      )}

      {!loading && !error && filteredItems.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-5 mt-6">
          {filteredItems.map((item) => {
            const isUpdating = updatingIds.has(item.progressId);
            const done = isCompleted(item);
            const totalChap =
              item.totalChapters > 0 ? item.totalChapters : null;

            return (
              <article key={item.progressId} className="group flex flex-col">
                <button
                  type="button"
                  onClick={() => setSelectedItem(item)}
                  className="relative block w-full text-left cursor-pointer"
                  style={{
                    borderRadius: "var(--radius-card)",
                    overflow: "hidden",
                  }}
                >
                  <Cover
                    src={item.coverUrl}
                    title={item.title}
                    type={item.type}
                  />

                  {/* Fade when completed */}
                  {done && (
                    <div
                      className="absolute inset-0 pointer-events-none"
                      style={{ background: "rgba(10,11,16,.55)" }}
                    />
                  )}

                  {/* "Finished" badge */}
                  {done && (
                    <div
                      className="absolute top-2 right-2 px-2 py-0.5 rounded-md text-[10px] font-mono uppercase tracking-wider"
                      style={{
                        background: "rgba(16, 185, 129, .85)",
                        color: "white",
                      }}
                    >
                      Finished
                    </div>
                  )}

                  {/* Remove (×) button — top-right, visible on hover */}
                  {!done && (
                    <span
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item);
                      }}
                      role="button"
                      aria-label={`Remove ${item.title} from list`}
                      tabIndex={0}
                      className="absolute top-2 right-2 w-8 h-8 rounded-full flex items-center justify-center
                 opacity-0 group-hover:opacity-100 transition-all duration-200
                 hover:scale-110 cursor-pointer"
                      style={{
                        background: "rgba(0,0,0,.7)",
                        color: "white",
                        backdropFilter: "blur(6px)",
                      }}
                    >
                      <Icon.Close />
                    </span>
                  )}
                </button>

                <div className="mt-3 space-y-2">
                  <div>
                    <h3
                      className="text-[14px] font-medium text-white leading-snug line-clamp-1"
                      title={item.title}
                    >
                      {item.title}
                    </h3>
                    <div
                      className="text-[11px] font-mono uppercase tracking-wider mt-0.5"
                      style={{ color: "var(--text-mute)" }}
                    >
                      {item.type}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Progress
                      value={item.currentChapter}
                      total={item.totalChapters || 1}
                      size="md"
                    />

                    {/* Editable chapter + controls */}
                    <div className="flex items-center gap-2 text-[11px] font-mono">
                      <span style={{ color: "var(--text-dim)" }}>Chapter</span>
                      <ChapterInput
                        value={item.currentChapter}
                        max={totalChap}
                        disabled={isUpdating}
                        onCommit={(v) => setField(item, "currentChapter", v)}
                      />
                      <span style={{ color: "var(--text-mute)" }}>
                        / {totalChap ?? "?"}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <IconButton
                        size="sm"
                        label={`Decrement chapter for ${item.title}`}
                        onClick={() => changeField(item, "currentChapter", -1)}
                        disabled={isUpdating || item.currentChapter === 0}
                      >
                        <Icon.Minus />
                      </IconButton>
                      <IconButton
                        size="sm"
                        label={`Increment chapter for ${item.title}`}
                        variant="accent"
                        onClick={() => changeField(item, "currentChapter", +1)}
                        disabled={
                          isUpdating ||
                          (totalChap !== null &&
                            item.currentChapter >= totalChap)
                        }
                      >
                        <Icon.Plus />
                      </IconButton>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}

          <WorkDetailModal
            open={selectedItem !== null}
            onClose={() => setSelectedItem(null)}
            detail={
              selectedItem
                ? {
                    kind: "library",
                    item: selectedItem,
                    onInc: () =>
                      changeField(selectedItem, "currentChapter", +1),
                    onDec: () =>
                      changeField(selectedItem, "currentChapter", -1),
                    onRemove: () => handleRemove(selectedItem),
                    updating: updatingIds.has(selectedItem.progressId),
                  }
                : null
            }
          />
        </div>
      )}
    </div>
  );
}

// ── Stat card ────────────────────────────────────────────────────────────
interface StatCardProps {
  label: string;
  value: number;
  accent?: boolean;
  mono?: boolean;
}

function StatCard({ label, value, accent, mono }: StatCardProps) {
  return (
    <div
      className="rounded-2xl p-3.5 md:p-4 transition-all duration-200 hover:scale-[1.01]"
      style={{
        background: accent
          ? "color-mix(in oklch, var(--accent) 12%, var(--surface))"
          : "var(--surface)",
        border: `1px solid ${
          accent
            ? "color-mix(in oklch, var(--accent) 30%, transparent)"
            : "var(--border)"
        }`,
      }}
    >
      <div
        className="text-[10px] uppercase tracking-[.18em] font-mono"
        style={{ color: "var(--text-mute)" }}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-[28px] md:text-[32px] leading-none tabular-nums tracking-tight ${
          mono ? "font-mono" : "font-serif"
        }`}
        style={{ color: accent ? "var(--accent)" : "white" }}
      >
        {value}
      </div>
    </div>
  );
}

// ── Empty state ──────────────────────────────────────────────────────────
interface EmptyStateProps {
  title: string;
  body: string;
  action?: React.ReactNode;
}

function EmptyState({ title, body, action }: EmptyStateProps) {
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
        <Icon.Bookmark />
      </div>
      <h3 className="font-serif text-[22px] text-white">{title}</h3>
      <p
        className="mt-2 text-[14px] max-w-sm"
        style={{ color: "var(--text-dim)" }}
      >
        {body}
      </p>
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}

interface ChapterInputProps {
  value: number;
  max?: number | null;
  disabled?: boolean;
  onCommit: (newValue: number) => void;
}

function ChapterInput({ value, max, disabled, onCommit }: ChapterInputProps) {
  const [local, setLocal] = useState(value.toString());

  // Sync local state when the external value changes (e.g., after +/- click)
  useEffect(() => {
    setLocal(value.toString());
  }, [value]);

  function commit() {
    const v = parseInt(local, 10);
    if (isNaN(v) || v === value) {
      setLocal(value.toString());
      return;
    }
    const cap = max ?? 9999;
    const clamped = Math.max(0, Math.min(cap, v));
    onCommit(clamped);
  }

  return (
    <input
      type="number"
      value={local}
      onChange={(e) => setLocal(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          e.currentTarget.blur();
        } else if (e.key === "Escape") {
          setLocal(value.toString());
          e.currentTarget.blur();
        }
      }}
      disabled={disabled}
      min={0}
      max={max ?? 9999}
      aria-label="Current chapter"
      className="w-14 px-1.5 py-0.5 rounded text-center tabular-nums text-[12px] font-mono
                 text-white outline-none transition-colors duration-150
                 focus:ring-2 focus:ring-[var(--accent)]
                 disabled:opacity-50"
      style={{
        background: "var(--surface-2)",
        border: "1px solid var(--border)",
      }}
    />
  );
}

export default MyListPage;
