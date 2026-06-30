import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Plus, Package, Trash2 } from "lucide-react";
import { useMaterials, useDeleteMaterial } from "../hooks/useMaterials";
import { materialPhotoUrl } from "../api/materials.api";
import { usd } from "../lib/calc";
import { MaterialForm } from "./MaterialForm";

export function MaterialsPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: materials = [], isLoading } = useMaterials();
  const deleteMaterial = useDeleteMaterial();
  const [showForm, setShowForm] = useState(false);

  return (
    <div className="animate-fade-up">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-h2 uppercase text-white drop-shadow-sm">{t("nav.materials")}</h1>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex h-10 items-center gap-2 rounded-xl bg-white/90 px-4 text-[14px] font-semibold text-primary shadow-sm backdrop-blur transition-colors hover:bg-white">
          <Plus className="h-4 w-4" /> {t("mat.new")}
        </button>
      </header>

      {showForm && <MaterialForm onDone={() => setShowForm(false)} />}

      {isLoading ? (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => <div key={i} className="aspect-[4/3] animate-pulse rounded-2xl bg-white/30" />)}
        </div>
      ) : materials.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Package className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-title text-foreground">{t("mat.emptyTitle")}</p>
          <p className="mt-1 text-body text-muted-foreground">{t("mat.emptyDesc")}</p>
        </div>
      ) : (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 lg:grid-cols-6">
          {materials.map((m) => (
            <div key={m.id} className="glass group relative overflow-hidden rounded-2xl">
              <button onClick={() => navigate(`/materials/${m.id}`)} className="block w-full text-left">
                <div className="aspect-[4/3] overflow-hidden bg-secondary/40">
                  {m.cover_path ? (
                    <img src={materialPhotoUrl(m.cover_path)} alt={m.name} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  ) : (
                    <div className="flex h-full items-center justify-center"><Package className="h-7 w-7 text-muted-foreground" /></div>
                  )}
                </div>
                <div className="p-2.5">
                  <div className="truncate text-[13.5px] font-bold text-foreground">{m.name}</div>
                  <div className="mt-0.5 truncate text-[11.5px] text-muted-foreground">
                    {[m.thickness, m.finish].filter(Boolean).join(" • ") || "—"}
                  </div>
                  {m.price_sqm != null && (
                    <div className="mt-1 text-[12px] font-semibold text-success">{usd(m.price_sqm)}/m²</div>
                  )}
                </div>
              </button>
              <button
                onClick={() => { if (confirm(t("mat.confirmDelete"))) deleteMaterial.mutate(m.id); }}
                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-muted-foreground opacity-0 backdrop-blur transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={t("mat.delete")}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
