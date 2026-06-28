export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-2.5">
      <img src="/logo-icon.png" alt="Stone Slab" className="h-8 w-8 rounded-lg" />
      {!compact && (
        <span className="font-display text-[19px] font-semibold text-foreground">
          Stone Slab <span className="text-primary">IND</span>
        </span>
      )}
    </div>
  );
}
