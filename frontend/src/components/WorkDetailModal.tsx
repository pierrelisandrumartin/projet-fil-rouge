import { useEffect } from "react";
import type { LibraryItem, WorkSearchResult } from "../types/api";
import Modal from "./ui/Modal";
import Cover from "./ui/Cover";
import Button from "./ui/Button";
import IconButton from "./ui/IconButton";
import Progress from "./ui/Progress";
import { Icon } from "./ui/Icon";

// Type union : soit on affiche un résultat de recherche (pas encore en BDD),
// soit un item de la library (avec progress éditable)
type DetailMode =
  | {
      kind: "search";
      work: WorkSearchResult;
      inLibrary: boolean;
      onAdd: () => void;
      adding: boolean;
    }
  | {
      kind: "library";
      item: LibraryItem;
      onInc: () => void;
      onDec: () => void;
      onRemove: () => void;
      updating: boolean;
    };

interface WorkDetailModalProps {
  open: boolean;
  onClose: () => void;
  detail: DetailMode | null;
}

function WorkDetailModal({ open, onClose, detail }: WorkDetailModalProps) {
  // Lock scroll while modal is open
  useEffect(() => {
    if (!open) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = original;
    };
  }, [open]);

  if (!detail) return null;

  // Common fields extracted from either mode
  const isLibrary = detail.kind === "library";
  const work = isLibrary
    ? {
        title: detail.item.title,
        synopsis: detail.item.synopsis,
        coverUrl: detail.item.coverUrl,
        type: detail.item.type,
        status: detail.item.status,
        totalVolumes: detail.item.totalVolumes,
        totalChapters: detail.item.totalChapters,
      }
    : {
        title: detail.work.title,
        synopsis: detail.work.synopsis,
        coverUrl: detail.work.coverUrl,
        type: detail.work.type,
        status: detail.work.status,
        totalVolumes: detail.work.volumes,
        totalChapters: detail.work.chapters,
      };

  return (
    <Modal open={open} onClose={onClose}>
      <div className="grid md:grid-cols-[280px_1fr] h-full md:h-auto md:max-h-[90vh] overflow-auto">
        {/* Cover side */}
        <div
          className="relative p-6 md:p-8"
          style={{ background: "var(--surface-2)" }}
        >
          {/* Blurred backdrop with the cover */}
          <div className="absolute inset-0 overflow-hidden" aria-hidden="true">
            <Cover
              src={work.coverUrl}
              title={work.title}
              showTypeBadge={false}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "color-mix(in oklch, var(--surface-2) 75%, transparent)",
                backdropFilter: "blur(20px)",
              }}
            />
          </div>

          {/* The actual cover (centered) */}
          <div className="relative flex justify-center">
            <div
              className="w-44 rounded-xl overflow-hidden"
              style={{ boxShadow: "0 30px 60px -20px rgba(0,0,0,.6)" }}
            >
              <Cover
                src={work.coverUrl}
                title={work.title}
                type={work.type}
              />
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6 md:p-8 relative">
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Close"
            className="absolute top-5 right-5 w-9 h-9 rounded-full items-center justify-center
                       text-lg hover:scale-110 transition-transform flex"
            style={{
              background: "var(--surface-2)",
              color: "var(--text-dim)",
              border: "1px solid var(--border)",
            }}
          >
            <Icon.Close />
          </button>

          <div className="pr-12">
            <div
              className="text-[10px] uppercase tracking-[.24em] font-mono"
              style={{ color: "var(--accent)" }}
            >
              {work.type}
              {work.status && (
                <>
                  <span className="mx-1.5">·</span>
                  <span>{work.status}</span>
                </>
              )}
            </div>
            <h2 className="font-serif text-white mt-2 leading-tight tracking-tight text-[28px] md:text-[36px]">
              {work.title}
            </h2>
          </div>

          {/* Synopsis */}
          <p
            className="mt-5 text-[14px] leading-relaxed max-h-48 overflow-y-auto pr-2"
            style={{ color: "var(--text-dim)" }}
          >
            {work.synopsis || "No synopsis available."}
          </p>

          {/* Meta grid */}
          <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-3">
            <MetaCell
              label="Type"
              value={work.type || "—"}
            />
            <MetaCell
              label="Volumes"
              value={
                work.totalVolumes && work.totalVolumes > 0
                  ? String(work.totalVolumes)
                  : "?"
              }
              mono
            />
            <MetaCell
              label="Chapters"
              value={
                work.totalChapters && work.totalChapters > 0
                  ? String(work.totalChapters)
                  : "?"
              }
              mono
            />
          </div>

          {/* Library controls */}
          <div
            className="mt-7 p-4 rounded-2xl"
            style={{
              background: "var(--surface-2)",
              border: "1px solid var(--border)",
            }}
          >
            {detail.kind === "library" ? (
              <LibraryControls
                item={detail.item}
                onInc={detail.onInc}
                onDec={detail.onDec}
                onRemove={detail.onRemove}
                onClose={onClose}
                updating={detail.updating}
              />
            ) : (
              <SearchAddBlock
                work={detail.work}
                inLibrary={detail.inLibrary}
                onAdd={detail.onAdd}
                adding={detail.adding}
              />
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

// ── Library controls ────────────────────────────────────────────────────
interface LibraryControlsProps {
  item: LibraryItem;
  onInc: () => void;
  onDec: () => void;
  onRemove: () => void;
  onClose: () => void;
  updating: boolean;
}

function LibraryControls({
  item,
  onInc,
  onDec,
  onRemove,
  onClose,
  updating,
}: LibraryControlsProps) {
  const totalChap = item.totalChapters > 0 ? item.totalChapters : null;
  const done =
    totalChap !== null && item.currentChapter >= totalChap;

  function handleRemove() {
    const confirmed = window.confirm(
      `Remove "${item.title}" from your list?`
    );
    if (!confirmed) return;
    onRemove();
    onClose();
  }

  return (
    <>
      <div className="flex items-center justify-between gap-3 mb-3">
        <div>
          <div
            className="text-[10px] uppercase tracking-[.18em] font-mono"
            style={{ color: "var(--text-mute)" }}
          >
            Progress
          </div>
          <div className="font-mono text-[20px] tabular-nums text-white mt-1">
            {item.currentChapter}{" "}
            <span style={{ color: "var(--text-mute)" }}>
              / {totalChap ?? "?"}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <IconButton
            size="md"
            label="Decrement chapter"
            onClick={onDec}
            disabled={updating || item.currentChapter === 0}
          >
            <Icon.Minus />
          </IconButton>
          <IconButton
            size="md"
            label="Increment chapter"
            variant="accent"
            onClick={onInc}
            disabled={
              updating || (totalChap !== null && item.currentChapter >= totalChap)
            }
          >
            <Icon.Plus />
          </IconButton>
        </div>
      </div>

      <Progress
        value={item.currentChapter}
        total={item.totalChapters || 1}
        size="lg"
      />

      {done && (
        <div
          className="mt-4 px-3 py-2 rounded-lg text-[12px] font-mono uppercase tracking-wider text-center"
          style={{ background: "rgba(16, 185, 129, .15)", color: "#6EE7B7" }}
        >
          ✓ Finished
        </div>
      )}

      <div className="mt-4 flex gap-2">
        <Button variant="danger" size="sm" onClick={handleRemove}>
          Remove from list
        </Button>
      </div>
    </>
  );
}

// ── Search-add block ────────────────────────────────────────────────────
interface SearchAddBlockProps {
  work: WorkSearchResult;
  inLibrary: boolean;
  onAdd: () => void;
  adding: boolean;
}

function SearchAddBlock({
  work,
  inLibrary,
  onAdd,
  adding,
}: SearchAddBlockProps) {
  return (
    <div className="flex flex-col gap-3">
      <div>
        <div
          className="text-[10px] uppercase tracking-[.18em] font-mono"
          style={{ color: "var(--text-mute)" }}
        >
          {inLibrary ? "Already in your list" : "Not added yet"}
        </div>
        <div className="text-[14px] mt-1" style={{ color: "var(--text-dim)" }}>
          {inLibrary
            ? "Manage your progress from My list."
            : "Add this work to start tracking your progress."}
        </div>
      </div>
      {!inLibrary && (
        <Button onClick={onAdd} disabled={adding} icon={<Icon.Plus />}>
          {adding ? "Adding..." : "Add to list"}
        </Button>
      )}
      {/* Marker silencieux — pour éviter de référencer `work` inutilement (lint) */}
      <input type="hidden" value={work.externalId} readOnly />
    </div>
  );
}

// ── Meta cell ───────────────────────────────────────────────────────────
function MetaCell({
  label,
  value,
  mono,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div>
      <div
        className="text-[10px] uppercase tracking-[.18em] font-mono"
        style={{ color: "var(--text-mute)" }}
      >
        {label}
      </div>
      <div
        className={`mt-1 text-[14px] text-white ${
          mono ? "font-mono tabular-nums" : ""
        }`}
      >
        {value}
      </div>
    </div>
  );
}

export default WorkDetailModal;