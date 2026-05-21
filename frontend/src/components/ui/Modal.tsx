import type { ReactNode } from "react";
import { useEffect } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: ReactNode;
}

function Modal({ open, onClose, children }: ModalProps) {
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center p-0 md:p-6 animate-[fadeIn_.2s_ease]"
      onClick={onClose}
    >
      <div
        className="absolute inset-0"
        style={{
          background: "rgba(5,6,10,.7)",
          backdropFilter: "blur(8px)",
        }}
      />
      <div
        className="relative z-10 w-full md:max-w-4xl md:rounded-3xl overflow-hidden h-full md:h-auto md:max-h-[90vh]
                   animate-[modalIn_.3s_cubic-bezier(.2,.9,.3,1.2)]"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--border)",
          boxShadow: "0 30px 80px -20px rgba(0,0,0,.6)",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
}

export default Modal;
