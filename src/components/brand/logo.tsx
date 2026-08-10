import { cn } from "@/lib/utils";

export function Logo({ className, inverted }: { className?: string; inverted?: boolean }) {
  return (
    <span className={cn("flex items-center gap-2.5", className)}>
      <span
        aria-hidden
        className="relative grid size-9 shrink-0 place-items-center rounded-md bg-accent-gradient"
      >
        <span className="absolute inset-0 rounded-md ring-1 ring-inset ring-accent-foreground/20" />
        <svg viewBox="0 0 24 24" className="size-5 text-accent-foreground" fill="none">
          <circle cx="12" cy="12" r="4.2" fill="currentColor" />
          {Array.from({ length: 12 }).map((_, i) => (
            <line
              key={i}
              x1="12"
              y1="12"
              x2={12 + 9.4 * Math.cos((i * Math.PI) / 6)}
              y2={12 + 9.4 * Math.sin((i * Math.PI) / 6)}
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          ))}
        </svg>
      </span>
      <span className="flex flex-col leading-none">
        <span
          className={cn(
            "font-display text-base font-bold tracking-tight",
            inverted ? "text-primary-foreground" : "text-foreground",
          )}
        >
          Surya JanSeva
        </span>
        <span
          className={cn(
            "mt-1 text-[10px] font-medium uppercase tracking-[0.14em]",
            inverted ? "text-primary-foreground/70" : "text-muted-foreground",
          )}
        >
          Surya Group of Industries
        </span>
      </span>
    </span>
  );
}
