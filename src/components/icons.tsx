type P = { className?: string };

export const Arrow = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M4 12h15M13 6l6 6-6 6" />
  </svg>
);

export const Plus = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
    <path d="M12 5v14M5 12h14" />
  </svg>
);

export const Search = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="11" cy="11" r="7" />
    <path d="m20.5 20.5-4.5-4.5" />
  </svg>
);

export const User = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <circle cx="12" cy="8" r="4" />
    <path d="M4 21c1.2-4 4.3-6 8-6s6.8 2 8 6" />
  </svg>
);

export const Bag = ({ className }: P) => (
  <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" aria-hidden>
    <path d="M5 8h14l-1.2 13H6.2z" />
    <path d="M9 8V6.5a3 3 0 0 1 6 0V8" />
  </svg>
);

export const Truck = ({ className }: P) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
    <path d="M3 9h17v13H3zM20 13h5l4 4v5h-9z" />
    <circle cx="9" cy="24" r="2.5" />
    <circle cx="24" cy="24" r="2.5" />
  </svg>
);

export const Cash = ({ className }: P) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" aria-hidden>
    <rect x="3" y="8" width="26" height="16" rx="2" />
    <circle cx="16" cy="16" r="3.5" />
  </svg>
);

export const Swap = ({ className }: P) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
    <path d="M5 12h20l-5-5M27 20H7l5 5" />
  </svg>
);

export const Chat = ({ className }: P) => (
  <svg className={className} viewBox="0 0 32 32" fill="none" stroke="currentColor" strokeWidth="1.4" strokeLinejoin="round" aria-hidden>
    <path d="M16 4a12 12 0 0 0-10.4 18L4 28l6.2-1.6A12 12 0 1 0 16 4z" />
  </svg>
);
