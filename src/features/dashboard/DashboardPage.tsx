import { useTranslation } from "react-i18next";
import { Package, Layers, CheckCircle2, Clock, DollarSign } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const company = (user?.user_metadata?.company_name as string) ?? "";

  // Indicadores virão das tabelas reais nas próximas fatias.
  const cards = [
    { label: t("dash.materials"), value: "—", icon: Package },
    { label: t("dash.slabs"), value: "—", icon: Layers },
    { label: t("dash.available"), value: "—", icon: CheckCircle2 },
    { label: t("dash.reserved"), value: "—", icon: Clock },
  ];

  return (
    <div className="animate-fade-up">
      <header className="mb-6">
        <h1 className="font-display text-display text-foreground">
          {t("dash.hello")}{company ? `, ${company}` : ""}!
        </h1>
      </header>

      {/* Faixa de destaque (estilo Stone Block) */}
      <div className="mb-5 overflow-hidden rounded-2xl bg-gradient-to-r from-success to-success/70 p-6">
        <div className="flex items-center gap-2 text-[12px] font-semibold uppercase tracking-wider text-white/90">
          <DollarSign className="h-4 w-4" /> {t("dash.sold")}
        </div>
        <div className="mt-1 font-display text-3xl font-700 text-white">$0.00</div>
      </div>

      {/* Cards de indicadores */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {cards.map((c) => (
          <div key={c.label} className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-2 text-[13px] text-muted-foreground">
              <c.icon className="h-4 w-4" /> {c.label}
            </div>
            <div className="mt-2 font-display text-3xl font-700 text-foreground">{c.value}</div>
          </div>
        ))}
      </div>

      <p className="mt-8 text-center text-caption text-muted-foreground">{t("dash.soon")}</p>
    </div>
  );
}
