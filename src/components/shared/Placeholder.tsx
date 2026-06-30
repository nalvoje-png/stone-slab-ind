export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="animate-fade-up">
      <h1 className="text-h2 uppercase text-white drop-shadow-sm">{title}</h1>
      <div className="glass mt-6 rounded-2xl p-10 text-center">
        <p className="text-body text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
