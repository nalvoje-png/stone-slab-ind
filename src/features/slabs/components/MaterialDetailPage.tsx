import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { ArrowLeft, Plus, ImageOff, Trash2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSlabs, useDeleteSlab } from "../hooks/useSlabs";
import { SlabForm } from "./SlabForm";
import { materialPhotoUrl } from "@/features/materials/api/materials.api";
import { areaSqm, slabValue, usd, fmtSqm } from "@/features/materials/lib/calc";
import type { Material, SlabStatus } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

const statusCls: Record<SlabStatus, string> = {
  disponivel: "bg-success-soft text-success",
  reservada: "bg-warning-soft text-warning",
  vendida: "bg-destructive-soft text-destructive",
};

export function MaterialDetailPage() {
  const { materialId } = useParams<{ materialId: string }>();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showForm, setShowForm] = useState(false);

  const { data: material } = useQuery({
    queryKey: ["material", materialId],
    enabled: Boolean(materialId),
    queryFn: async (): Promise<Material | null> => {
      const { data, error } = await db.from("materials").select("*").eq("id", materialId).maybeSingle();
      if (error) throw error;
      return data;
    },
  });

  const { data: slabs = [], isLoading } = useSlabs(materialId);
  const deleteSlab = useDeleteSlab(materialId!);

  return (
    <div className="animate-fade-up">
      <button onClick={() => navigate("/materials")} className="mb-3 inline-flex items-center gap-1.5 text-[13px] font-semibold text-white/90 hover:text-white">
        <ArrowLeft className="h-4 w-4" /> {t("slab.backToMaterials")}
      </button>

      <header className="mb-5 flex items-center justify-between">
        <div>
          <h1 className="text-h2 uppercase text-white drop-shadow-sm">{material?.name}</h1>
          <p className="text-[13px] text-white/80">
            {[material?.thickness, material?.finish].filter(Boolean).join(" • ")}
            {material?.price_sqm != null && ` • ${usd(material.price_sqm)}/m²`}
          </p>
        </div>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex h-10 items-center gap-2 rounded-xl bg-white/90 px-4 text-[14px] font-semibold text-primary shadow-sm backdrop-blur hover:bg-white">
          <Plus className="h-4 w-4" /> {t("slab.new")}
        </button>
      </header>

      {showForm && material && <SlabForm material={material} onDone={() => setShowForm(false)} />}

      {isLoading ? (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="aspect-[3/4] animate-pulse rounded-2xl bg-white/30" />)}
        </div>
      ) : slabs.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <ImageOff className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-title text-foreground">{t("slab.emptyTitle")}</p>
          <p className="mt-1 text-body text-muted-foreground">{t("slab.emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {slabs.map((s) => {
            const sqm = s.length_m && s.height_m ? areaSqm(s.length_m, s.height_m) : null;
            const price = s.price_sqm ?? material?.price_sqm ?? null;
            const value = sqm != null ? slabValue(sqm, price) : null;
            return (
              <div key={s.id} className="glass group relative overflow-hidden rounded-2xl">
                <div className="aspect-[3/4] overflow-hidden bg-secondary/40">
                  {s.photo_path ? (
                    <img src={materialPhotoUrl(s.photo_path)} alt={s.code} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><ImageOff className="h-7 w-7 text-muted-foreground" /></div>
                  )}
                  <span className={`absolute right-2 top-2 rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusCls[s.status]}`}>
                    {t(`slab.status.${s.status}`)}
                  </span>
                </div>
                <div className="p-3">
                  <div className="text-[14px] font-bold text-foreground">{s.code}</div>
                  {sqm != null && (
                    <div className="mt-0.5 text-[11.5px] text-muted-foreground">
                      {s.length_m} × {s.height_m} m · {fmtSqm(sqm)}
                    </div>
                  )}
                  {value != null && <div className="mt-1 text-[13.5px] font-bold text-success">{usd(value)}</div>}
                </div>
                <button
                  onClick={() => { if (confirm(t("slab.confirmDelete"))) deleteSlab.mutate(s.id); }}
                  className="absolute left-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
                  aria-label={t("slab.delete")}
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
