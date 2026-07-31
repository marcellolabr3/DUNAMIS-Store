import { Link } from 'react-router-dom';

interface SiteLogoProps {
  compact?: boolean;
  inverted?: boolean;
  logoUrl?: string;
  storeName?: string;
}

export function SiteLogo({
  compact = false,
  inverted = false,
  logoUrl = '',
  storeName = 'DUNAMIS STORE'
}: SiteLogoProps) {
  return (
    <Link
      aria-label={`${storeName} - pagina inicial`}
      className={`inline-flex items-center gap-3 font-bold ${
        inverted ? 'text-white' : 'text-secondary'
      }`}
      to="/"
    >
      {logoUrl ? (
        <img
          alt={storeName}
          className="size-10 rounded bg-surface object-contain shadow-sm ring-1 ring-secondary/10"
          src={logoUrl}
        />
      ) : (
        <span className="grid size-10 place-items-center rounded bg-primary text-sm font-black text-secondary shadow-sm ring-1 ring-secondary/10">
          DS
        </span>
      )}
      {!compact && (
        <span className="leading-tight">
          <span className="block text-base tracking-wide">DUNAMIS</span>
          <span
            className={`block text-xs font-semibold ${
              inverted ? 'text-white/65' : 'text-text-light'
            }`}
          >
            STORE
          </span>
        </span>
      )}
    </Link>
  );
}
