import type { ReactNode } from "react";

interface IconWrapperProps {
  d?: string;
  children?: ReactNode;
  sw?: number;
}

function IconWrapper({ d, children, sw = 1.6 }: IconWrapperProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      width="1em"
      height="1em"
      fill="none"
      stroke="currentColor"
      strokeWidth={sw}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {d ? <path d={d} /> : null}
      {children}
    </svg>
  );
}

export const Icon = {
  Home: () => <IconWrapper d="M3 11 12 4l9 7v8a2 2 0 0 1-2 2h-3v-6h-8v6H5a2 2 0 0 1-2-2z" />,
  Compass: () => (
    <IconWrapper>
      <circle cx="12" cy="12" r="9" />
      <path d="m15 9-2 5-5 2 2-5z" />
    </IconWrapper>
  ),
  Library: () => <IconWrapper d="M4 4v16M9 4v16M14 6l4-1 3 16-4 1z" />,
  User: () => (
    <IconWrapper>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21a8 8 0 0 1 16 0" />
    </IconWrapper>
  ),
  Logout: () => <IconWrapper d="M15 4h3a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2h-3M10 17l-5-5 5-5M5 12h12" />,
  Search: () => (
    <IconWrapper>
      <circle cx="11" cy="11" r="7" />
      <path d="m20 20-3.5-3.5" />
    </IconWrapper>
  ),
  Plus: () => <IconWrapper d="M12 5v14M5 12h14" />,
  Minus: () => <IconWrapper d="M5 12h14" />,
  Close: () => <IconWrapper d="M6 6l12 12M6 18 18 6" />,
  Check: () => <IconWrapper d="m5 12 4 4L19 6" />,
  Menu: () => <IconWrapper d="M4 7h16M4 12h16M4 17h16" />,
  Bell: () => <IconWrapper d="M6 8a6 6 0 1 1 12 0c0 5 2 6 2 6H4s2-1 2-6M10 21a2 2 0 0 0 4 0" />,
  Mail: () => (
    <IconWrapper>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="m3 7 9 6 9-6" />
    </IconWrapper>
  ),
  Lock: () => (
    <IconWrapper>
      <rect x="4" y="11" width="16" height="10" rx="2" />
      <path d="M8 11V8a4 4 0 1 1 8 0v3" />
    </IconWrapper>
  ),
  Bookmark: () => <IconWrapper d="M6 4h12v17l-6-4-6 4z" />,
  Inbox: () => <IconWrapper d="M3 12h6l2 3h2l2-3h6M5 4h14l3 8v8H2v-8z" />,
};