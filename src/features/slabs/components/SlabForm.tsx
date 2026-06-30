import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, Calculator } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCreateSlab, useCreateSlabsBatch } from "../hooks/useSlabs";
import { uploadMaterialPhoto } from "@/features/materials/api/materials.api";
import { areaSqm, sqmToSqft, slabValue, usd, fmtSqm, fmtSqft, pricePerSqmToSqft, pricePerSqftToSqm } from "@/features/materials/lib/calc";
import type { Material } from "@/types/database";

const MAX_BATCH = 7;

export function SlabForm({ material, onDone }: { material: Material; onDone: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const createSlab = useCreateSlab(material.id);
  const createBatch = useCreateSlabsBatch(material.id);

  const [mode, setMode] = useState<"single" | "batch">("single");

  // comuns (medidas + preço) — usados nos dois modos
  const [lengthM, setLengthM] = useState("");
  const [heightM, setHeightM] = useState("");
  const [priceSqm, setPriceSqm] = useState(material.price_sqm != null ? String(material.price_sqm) : "");
  const [priceSqft, setPriceSqft] = useState(material.price_sqft != null ? String(material.price_sqft) : "");

  // modo único
  const [code, setCode] = useState("");
  const [photo, setPhoto] = useState<File | null>(null);

  // modo lote: linhas {code, file}
  const [rows, setRows] = useState<{ code: string; file: File | null }[]>([{ code: "", file: null }]);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function onPriceSqm(v: string) {
    setPriceSqm(v);
    const n = parseFloat(v);
    setPriceSqft(isNaN(n) ? "" : String(pricePerSqmToSqft(n)));
  }
  function onPriceSqft(v: string) {
    setPriceSqft(v);
    const n = parseFloat(v);
    setPriceSqm(isNaN(n) ? "" : String(pricePerSqftToSqm(n)));
  }

  const L = parseFloat(lengthM), H = parseFloat(heightM);
  const previewSqm = !isNaN(L) && !isNaN(H) ? areaSqm(L, H) : null;
  const pSqm = priceSqm ? parseFloat(priceSqm) : null;
  const previewValue = previewSqm != null ? slabValue(previewSqm, pSqm) : null;

  function updateRow(i: number, patch: Partial<{ code: string; file: File | null }>) {
    setRows((rs) => rs.map((r, idx) => (idx === i ? { ...r, ...patch } : r)));
  }
  function addRow() {
    setRows((rs) => (rs.length >= MAX_BATCH ? rs : [...rs, { code: "", file: null }]));
  }
  function removeRow(i: number) {
    setRows((rs) => rs.filter((_, idx) => idx !== i));
  }

  async function handleSaveSingle() {
    if (!code.trim()) return;
    setSaving(true); setError(null);
    try {
      let photo_path: string | undefined;
      if (photo) photo_path = await uploadMaterialPhoto(photo, user!.id);
      await createSlab.mutateAsync({
        company_id: user!.id,
        material_id: material.id,
        code: code.trim(),
        photo_path,
        length_m: lengthM ? parseFloat(lengthM) : undefined,
        height_m: heightM ? parseFloat(heightM) : undefined,
        price_sqm: priceSqm ? parseFloat(priceSqm) : undefined,
        price_sqft: priceSqft ? parseFloat(priceSqft) : undefined,
      });
      onDone();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? String(e));
    } finally { setSaving(false); }
  }

  async function handleSaveBatch() {
    const valid = rows.filter((r) => r.code.trim());
    if (valid.length === 0) { setError(t("slab.batchNeedCode")); return; }
    setSaving(true); setError(null);
    try {
      await createBatch.mutateAsync({
        common: {
          company_id: user!.id,
          material_id: material.id,
          length_m: lengthM ? parseFloat(lengthM) : undefined,
          height_m: heightM ? parseFloat(heightM) : undefined,
          price_sqm: priceSqm ? parseFloat(priceSqm) : undefined,
          price_sqft: priceSqft ? parseFloat(priceSqft) : undefined,
        },
        items: valid.map((r) => ({ code: r.code, file: r.file })),
      });
      onDone();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? String(e));
    } finally { setSaving(false); }
  }

  const inputCls = "h-11 w-full rounded-xl border border-input bg-white px-3 text-body text-foreground outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1.5 block text-[13px] font-semibold text-foreground";

  return (
    <div className="glass mb-5 rounded-2xl p-5">
      {/* Toggle modo */}
      <div className="mb-4 inline-flex rounded-xl border border-input bg-white p-1">
        <button onClick={() => setMode("single")}
          className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold ${mode === "single" ? "bg-primary text-white" : "text-muted-foreground"}`}>
          {t("slab.modeSingle")}
        </button>
        <button onClick={() => setMode("batch")}
          className={`rounded-lg px-4 py-1.5 text-[13px] font-semibold ${mode === "batch" ? "bg-primary text-white" : "text-muted-foreground"}`}>
          {t("slab.modeBatch")}
        </button>
      </div>

      {/* Medidas + preço (comuns) */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <div>
          <label className={labelCls}>{t("slab.length")} (m)</label>
          <input value={lengthM} onChange={(e) => setLengthM(e.target.value)} placeholder="3.25" inputMode="decimal" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t("slab.height")} (m)</label>
          <input value={heightM} onChange={(e) => setHeightM(e.target.value)} placeholder="1.95" inputMode="decimal" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t("slab.priceSqm")}</label>
          <input value={priceSqm} onChange={(e) => onPriceSqm(e.target.value)} placeholder="0.00" inputMode="decimal" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t("slab.priceSqft")}</label>
          <input value={priceSqft} onChange={(e) => onPriceSqft(e.target.value)} placeholder="0.00" inputMode="decimal" className={inputCls} />
        </div>
      </div>

      {previewSqm != null && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2.5 text-[12.5px] text-success">
          <Calculator className="h-4 w-4 shrink-0" />
          {fmtSqm(previewSqm)} • {fmtSqft(sqmToSqft(previewSqm))}{previewValue != null && ` • ${usd(previewValue)}`}
        </div>
      )}

      {/* Modo único */}
      {mode === "single" ? (
        <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
          <div>
            <label className={labelCls}>{t("slab.code")}</label>
            <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="OF-2024-001" className={inputCls} />
          </div>
          <div>
            <label className={labelCls}>{t("slab.photo")}</label>
            <input type="file" accept="image/*" onChange={(e) => setPhoto(e.target.files?.[0] ?? null)}
              className="block w-full text-[13px] text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-foreground" />
          </div>
        </div>
      ) : (
        /* Modo lote */
        <div className="mt-4">
          <p className="mb-2 text-[13px] font-semibold text-foreground">{t("slab.batchTitle", { max: MAX_BATCH })}</p>
          <div className="space-y-2">
            {rows.map((r, i) => (
              <div key={i} className="flex items-center gap-2">
                <span className="w-6 text-center text-[13px] font-semibold text-muted-foreground">{i + 1}</span>
                <input value={r.code} onChange={(e) => updateRow(i, { code: e.target.value })} placeholder={t("slab.code")} className={inputCls + " flex-1"} />
                <label className="flex h-11 cursor-pointer items-center gap-1.5 rounded-xl border border-input bg-white px-3 text-[12.5px] font-medium text-muted-foreground">
                  {r.file ? "✓ " + t("slab.photoOk") : t("slab.photoPick")}
                  <input type="file" accept="image/*" className="hidden" onChange={(e) => updateRow(i, { file: e.target.files?.[0] ?? null })} />
                </label>
                {rows.length > 1 && (
                  <button onClick={() => removeRow(i)} className="flex h-9 w-9 items-center justify-center rounded-lg text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {rows.length < MAX_BATCH && (
            <button onClick={addRow} className="mt-2 flex items-center gap-1.5 text-[13px] font-semibold text-primary">
              <Plus className="h-4 w-4" /> {t("slab.addRow")}
            </button>
          )}
        </div>
      )}

      {error && <div className="mt-3 rounded-lg bg-destructive-soft px-3 py-2.5 text-[12.5px] text-destructive">{error}</div>}

      <div className="mt-4 flex gap-2">
        <button onClick={mode === "single" ? handleSaveSingle : handleSaveBatch} disabled={saving}
          className="h-11 rounded-xl bg-primary px-5 text-[14px] font-semibold text-white disabled:opacity-50">
          {saving ? t("slab.saving") : mode === "single" ? t("slab.save") : t("slab.saveBatch")}
        </button>
        <button onClick={onDone} className="h-11 rounded-xl border border-input bg-white px-5 text-[14px] font-semibold text-foreground">
          {t("slab.cancel")}
        </button>
      </div>
    </div>
  );
}
