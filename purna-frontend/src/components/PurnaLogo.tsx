interface PurnaLogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
}

const PurnaLogo = ({ size = 36, showText = true, className = "" }: PurnaLogoProps) => (
  <div className={`flex items-center gap-2 ${className}`}>
    <svg width={size} height={size} viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Bowl */}
      <ellipse cx="24" cy="32" rx="18" ry="8" className="fill-primary" opacity="0.9" />
      <ellipse cx="24" cy="30" rx="18" ry="8" className="fill-primary" />
      {/* Salad leaves */}
      <path d="M16 26c-2-6 2-14 8-14s10 8 8 14" className="fill-success" opacity="0.7" />
      <path d="M20 26c-1-5 1-11 5-11s7 6 5 11" className="fill-primary" opacity="0.5" />
      {/* Tomato */}
      <circle cx="30" cy="24" r="3.5" className="fill-destructive" opacity="0.8" />
      {/* Yellow accent */}
      <circle cx="18" cy="25" r="2.5" className="fill-secondary" opacity="0.9" />
    </svg>
    {showText && (
      <span className="text-xl font-bold tracking-tight text-foreground">
        Purna
      </span>
    )}
  </div>
);

export default PurnaLogo;
