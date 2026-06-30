import { useTranslation } from "react-i18next";
import { Package, Layers, CheckCircle2, Clock, DollarSign, TrendingUp } from "lucide-react";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, ResponsiveContainer, Tooltip } from "recharts";
import { useAuth } from "@/features/auth/hooks/useAuth";

const EMERALD = "#1E8E5A";
const EMERALD_LIGHT = "#5CB98A";
const NEUTRAL = "#CBD5E1";

function Spark({ data, color = EMERALD }: { data: number[]; color?: string }) {
  const chartData = data.map((v, i) => ({ i, v }));
  return (
    <ResponsiveContainer width={72} height={36}>
      <BarChart data={chartData} barCategoryGap={2}>
        <Bar dataKey="v" radius={[2, 2, 0, 0]} fill={color} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DashboardPage() {
  const { t } = useTranslation();
  const { user } = useAuth();
  const company = (user?.user_metadata?.company_name as string) ?? "";

  const cards = [
    { label: t("dash.materials"), value: "—", icon: Package, spark: [3, 5, 4, 6, 5, 7, 6], color: EMERALD },
    { label: t("dash.slabs"), value: "—", icon: Layers, spark: [4, 3, 5, 4, 6, 5, 7], color: EMERALD },
    { label: t("dash.available"), value: "—", icon: CheckCircle2, spark: [5, 4, 3, 4, 3, 2, 3], color: NEUTRAL },
    { label: t("dash.reserved"), value: "—", icon: Clock, spark: [1, 2, 1, 3, 2, 3, 2], color: NEUTRAL },
  ];

  const pieData = [
    { name: t("dash.available"), value: 0, color: EMERALD },
    { name: t("dash.reserved"), value: 0, color: EMERALD_LIGHT },
    { name: t("dash.sold"), value: 0, color: NEUTRAL },
  ];
  const hasPie = pieData.some((d) => d.value > 0);

  const monthData = [
    { m: "Jan", v: 0 }, { m: "Fev", v: 0 }, { m: "Mar", v: 0 },
    { m: "Abr", v: 0 }, { m: "Mai", v: 0 }, { m: "Jun", v: 0 },
  ];

  return (
    <div className="animate-fade-up">
      <header className="mb-5">
        <h1 className="text-h1 uppercase text-white drop-shadow-sm">
          {t("dash.hello")}{company ? `, ${company}` : ""}!
        </h1>
      </header>

      <div className="mb-4 flex items-center justify-between overflow-hidden rounded-3xl bg-gradient-to-r from-emerald to-success px-5 py-4 shadow-lg">
        <div>
          <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white/90">
            <DollarSign className="h-3.5 w-3.5" /> {t("dash.sold")}
          </div>
          <div className="mt-0.5 text-2xl font-extrabold text-white">$0.00</div>
        </div>
        <TrendingUp className="h-8 w-8 text-white/40" />
      </div>

      <div className="mb-4 grid grid-cols-2 gap-4">
        {cards.map((c) => (
          <div key={c.label} className="glass rounded-3xl p-5">
            <div className="flex items-center gap-2 text-[13px] font-semibold text-muted-foreground">
              <c.icon className="h-4 w-4" /> {c.label}
            </div>
            <div className="mt-2 flex items-end justify-between">
              <div className="text-2xl font-extrabold text-foreground">{c.value}</div>
              <Spark data={c.spark} color={c.color} />
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <div className="glass rounded-3xl p-5">
          <h3 className="mb-1 text-title text-foreground">{t("dash.distribution")}</h3>
          <p className="mb-3 text-caption text-muted-foreground">{t("dash.distributionDesc")}</p>
          {hasPie ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={140} height={140}>
                <PieChart>
                  <Pie data={pieData} dataKey="value" innerRadius={40} outerRadius={66} paddingAngle={2}>
                    {pieData.map((d, i) => <Cell key={i} fill={d.color} />)}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2">
                {pieData.map((d) => (
                  <div key={d.name} className="flex items-center gap-2 text-[13px] text-foreground">
                    <span className="h-3 w-3 rounded-full" style={{ background: d.color }} /> {d.name}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="flex h-[140px] items-center justify-center rounded-2xl bg-white/40 text-caption text-muted-foreground">
              {t("dash.noData")}
            </div>
          )}
        </div>

        <div className="glass rounded-3xl p-5">
          <h3 className="mb-1 text-title text-foreground">{t("dash.monthly")}</h3>
          <p className="mb-3 text-caption text-muted-foreground">{t("dash.monthlyDesc")}</p>
          <ResponsiveContainer width="100%" height={160}>
            <BarChart data={monthData}>
              <XAxis dataKey="m" tick={{ fontSize: 12, fill: "#1e4853" }} axisLine={false} tickLine={false} />
              <Tooltip cursor={{ fill: "rgba(255,255,255,0.3)" }} />
              <Bar dataKey="v" radius={[4, 4, 0, 0]} fill={EMERALD} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <p className="mt-6 text-center text-caption text-white/70">{t("dash.soon")}</p>
    </div>
  );
}
