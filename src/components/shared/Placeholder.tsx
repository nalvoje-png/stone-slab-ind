// Tela provisória para seções ainda não construídas.
export function Placeholder({ title, note }: { title: string; note: string }) {
  return (
    <div className="animate-fade-up">
      <h1 className="font-display text-h1 text-foreground">{title}</h1>
      <div className="mt-6 rounded-2xl border border-dashed border-border p-10 text-center">
        <p className="text-body text-muted-foreground">{note}</p>
      </div>
    </div>
  );
}
