import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/features/auth/hooks/useAuth";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export interface DashboardStats {
  materials: number;
  slabs: number;
  available: number;
  reserved: number;
  sold: number;
  soldValue: number;
  // produção por mês (últimos 6 meses): nº de chapas cadastradas
  monthly: { m: string; v: number }[];
}

const MONTH_LABELS = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

export function useDashboardStats() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["dashboard-stats", user?.id],
    enabled: Boolean(user?.id),
    queryFn: async (): Promise<DashboardStats> => {
      const companyId = user!.id;

      // contagem de materiais
      const { count: materials } = await db
        .from("materials")
        .select("id", { count: "exact", head: true })
        .eq("company_id", companyId);

      // chapas: buscamos status, preço e medidas para contar e somar
      const { data: slabs } = await db
        .from("slabs")
        .select("status, price_sqm, length_m, height_m, created_at, material_id")
        .eq("company_id", companyId);

      const rows = slabs ?? [];
      let available = 0, reserved = 0, sold = 0, soldValue = 0;

      // precisamos do preço do material para chapas sem preço próprio
      const matIds = [...new Set(rows.map((r: any) => r.material_id))];
      const priceByMaterial: Record<string, number | null> = {};
      if (matIds.length) {
        const { data: mats } = await db.from("materials").select("id, price_sqm").in("id", matIds);
        (mats ?? []).forEach((m: any) => { priceByMaterial[m.id] = m.price_sqm; });
      }

      // produção por mês (últimos 6)
      const now = new Date();
      const buckets: { key: string; label: string; v: number }[] = [];
      for (let i = 5; i >= 0; i--) {
        const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
        buckets.push({ key: `${d.getFullYear()}-${d.getMonth()}`, label: MONTH_LABELS[d.getMonth()], v: 0 });
      }

      for (const r of rows as any[]) {
        if (r.status === "disponivel") available++;
        else if (r.status === "reservada") reserved++;
        else if (r.status === "vendida") {
          sold++;
          const price = r.price_sqm ?? priceByMaterial[r.material_id] ?? null;
          if (price != null && r.length_m && r.height_m) {
            soldValue += r.length_m * r.height_m * price;
          }
        }
        const d = new Date(r.created_at);
        const key = `${d.getFullYear()}-${d.getMonth()}`;
        const b = buckets.find((x) => x.key === key);
        if (b) b.v++;
      }

      return {
        materials: materials ?? 0,
        slabs: rows.length,
        available, reserved, sold,
        soldValue: +soldValue.toFixed(2),
        monthly: buckets.map((b) => ({ m: b.label, v: b.v })),
      };
    },
  });
}
