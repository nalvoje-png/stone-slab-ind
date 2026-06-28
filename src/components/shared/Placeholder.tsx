export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-h2 uppercase text-foreground">{title}</h1>
      <div className="mt-6 rounded-xl border border-dashed border-border bg-card p-10 text-center shadow-card">
        <p className="text-body text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
