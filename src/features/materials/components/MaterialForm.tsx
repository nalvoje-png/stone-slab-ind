import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, X, Calculator } from "lucide-react";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { useCreateMaterial, useFinishes, useCreateFinish } from "../hooks/useMaterials";
import { uploadMaterialPhoto } from "../api/materials.api";
import { pricePerSqmToSqft, pricePerSqftToSqm, usd } from "../lib/calc";

export function MaterialForm({ onDone }: { onDone: () => void }) {
  const { t } = useTranslation();
  const { user } = useAuth();
  const createMaterial = useCreateMaterial();
  const { data: finishes = [] } = useFinishes();
  const createFinish = useCreateFinish();

  const [name, setName] = useState("");
  const [thickness, setThickness] = useState("");
  const [finish, setFinish] = useState("");
  const [priceSqm, setPriceSqm] = useState("");
  const [priceSqft, setPriceSqft] = useState("");
  const [cover, setCover] = useState<File | null>(null);
  const [addingFinish, setAddingFinish] = useState(false);
  const [newFinish, setNewFinish] = useState("");
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

  async function handleAddFinish() {
    const nm = newFinish.trim();
    if (!nm) return;
    await createFinish.mutateAsync(nm);
    setFinish(nm);
    setNewFinish("");
    setAddingFinish(false);
  }

  async function handleSave() {
    if (!name.trim()) return;
    setSaving(true);
    setError(null);
    try {
      let coverPath: string | undefined;
      if (cover) coverPath = await uploadMaterialPhoto(cover, user!.id);
      await createMaterial.mutateAsync({
        name: name.trim(),
        thickness: thickness.trim() || undefined,
        finish: finish || undefined,
        cover_path: coverPath,
        price_sqm: priceSqm ? parseFloat(priceSqm) : undefined,
        price_sqft: priceSqft ? parseFloat(priceSqft) : undefined,
      });
      onDone();
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? String(e));
    } finally {
      setSaving(false);
    }
  }

  const inputCls = "h-11 w-full rounded-xl border border-input bg-white px-3 text-body text-foreground outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1.5 block text-[13px] font-semibold text-foreground";

  return (
    <div className="glass mb-5 rounded-2xl p-5">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label className={labelCls}>{t("mat.name")}</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Ocean Fantasy" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>{t("mat.thickness")}</label>
          <input value={thickness} onChange={(e) => setThickness(e.target.value)} placeholder="2cm" className={inputCls} />
        </div>

        <div>
          <label className={labelCls}>{t("mat.finish")}</label>
          {!addingFinish ? (
            <div className="flex gap-2">
              <select value={finish} onChange={(e) => setFinish(e.target.value)} className={inputCls}>
                <option value="">{t("mat.selectFinish")}</option>
                {finishes.map((f) => <option key={f.id} value={f.name}>{f.name}</option>)}
              </select>
              <button onClick={() => setAddingFinish(true)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-input text-primary hover:bg-secondary" aria-label={t("mat.addFinish")}>
                <Plus className="h-5 w-5" />
              </button>
            </div>
          ) : (
            <div className="flex gap-2">
              <input value={newFinish} onChange={(e) => setNewFinish(e.target.value)} placeholder={t("mat.newFinish")} className={inputCls}
                onKeyDown={(e) => e.key === "Enter" && handleAddFinish()} autoFocus />
              <button onClick={handleAddFinish} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary text-white" aria-label={t("mat.save")}>
                <Plus className="h-5 w-5" />
              </button>
              <button onClick={() => setAddingFinish(false)} className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-input text-muted-foreground" aria-label={t("mat.cancel")}>
                <X className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>

        <div>
          <label className={labelCls}>{t("mat.priceSqm")} (USD)</label>
          <input value={priceSqm} onChange={(e) => onPriceSqm(e.target.value)} placeholder="0.00" inputMode="decimal" className={inputCls} />
        </div>
        <div>
          <label className={labelCls}>{t("mat.priceSqft")} (USD)</label>
          <input value={priceSqft} onChange={(e) => onPriceSqft(e.target.value)} placeholder="0.00" inputMode="decimal" className={inputCls} />
        </div>

        <div className="sm:col-span-2">
          <label className={labelCls}>{t("mat.cover")}</label>
          <input type="file" accept="image/*" onChange={(e) => setCover(e.target.files?.[0] ?? null)}
            className="block w-full text-[13px] text-muted-foreground file:mr-3 file:rounded-lg file:border-0 file:bg-secondary file:px-3 file:py-2 file:text-[13px] file:font-semibold file:text-foreground" />
        </div>
      </div>

      {(priceSqm || priceSqft) && (
        <div className="mt-3 flex items-center gap-2 rounded-lg bg-success-soft px-3 py-2.5 text-[12.5px] text-success">
          <Calculator className="h-4 w-4 shrink-0" />
          {t("mat.priceHint", { sqm: usd(parseFloat(priceSqm) || 0), sqft: usd(parseFloat(priceSqft) || 0) })}
        </div>
      )}

      {error && <div className="mt-3 rounded-lg bg-destructive-soft px-3 py-2.5 text-[12.5px] text-destructive">{error}</div>}

      <div className="mt-4 flex gap-2">
        <button onClick={handleSave} disabled={saving || !name.trim()}
          className="h-11 rounded-xl bg-primary px-5 text-[14px] font-semibold text-white disabled:opacity-50">
          {saving ? t("mat.saving") : t("mat.save")}
        </button>
        <button onClick={onDone} className="h-11 rounded-xl border border-input px-5 text-[14px] font-semibold text-foreground">
          {t("mat.cancel")}
        </button>
      </div>
    </div>
  );
}
