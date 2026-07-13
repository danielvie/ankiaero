export function Logo({ className }: { className?: string }) {
  return (
    <svg aria-hidden="true" className={className} viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
      <g fill="#f6b44b">
        <g transform="translate(330 236)">
          <rect transform="rotate(-10)" width="136" height="30" rx="15" />
          <rect transform="translate(0 38) rotate(-10)" width="106" height="30" rx="15" />
          <rect transform="translate(0 76) rotate(-10)" width="76" height="30" rx="15" />
        </g>
        <g transform="translate(182 236) scale(-1 1)">
          <rect transform="rotate(-10)" width="136" height="30" rx="15" />
          <rect transform="translate(0 38) rotate(-10)" width="106" height="30" rx="15" />
          <rect transform="translate(0 76) rotate(-10)" width="76" height="30" rx="15" />
        </g>
      </g>
      <circle cx="256" cy="266" r="78" fill="#1e293b" stroke="#f6b44b" strokeWidth="14" />
      <path d="M220 268 l26 26 l46 -52" fill="none" stroke="#4ade80" strokeWidth="24" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
