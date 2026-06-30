import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Plus, Users, Trash2, Mail, Building2 } from "lucide-react";
import { useClients, useCreateClient, useDeleteClient } from "../hooks/useClients";
import type { ClientStatus } from "@/types/database";

const statusCls: Record<ClientStatus, string> = {
  convidado: "bg-warning-soft text-warning",
  ativo: "bg-success-soft text-success",
  inativo: "bg-secondary text-muted-foreground",
};

export function ClientsPage() {
  const { t } = useTranslation();
  const { data: clients = [], isLoading } = useClients();
  const createClient = useCreateClient();
  const deleteClient = useDeleteClient();

  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [companyName, setCompanyName] = useState("");
  const [country, setCountry] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSave() {
    if (!name.trim() || !email.trim()) return;
    setSaving(true); setError(null);
    try {
      await createClient.mutateAsync({
        name: name.trim(),
        email: email.trim(),
        company_name: companyName.trim() || undefined,
        country: country.trim() || undefined,
      });
      setName(""); setEmail(""); setCompanyName(""); setCountry(""); setShowForm(false);
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? String(e));
    } finally { setSaving(false); }
  }

  const inputCls = "h-11 w-full rounded-xl border border-input bg-white px-3 text-body text-foreground outline-none focus:ring-2 focus:ring-ring";
  const labelCls = "mb-1.5 block text-[13px] font-semibold text-foreground";

  return (
    <div className="animate-fade-up">
      <header className="mb-5 flex items-center justify-between">
        <h1 className="text-h2 uppercase text-white drop-shadow-sm">{t("clients.title")}</h1>
        <button onClick={() => setShowForm((v) => !v)}
          className="flex h-10 items-center gap-2 rounded-xl bg-white/90 px-4 text-[14px] font-semibold text-primary shadow-sm backdrop-blur hover:bg-white">
          <Plus className="h-4 w-4" /> {t("clients.new")}
        </button>
      </header>

      {showForm && (
        <div className="glass mb-5 rounded-2xl p-5">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label className={labelCls}>{t("clients.name")}</label>
              <input value={name} onChange={(e) => setName(e.target.value)} placeholder="John Smith" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("clients.email")}</label>
              <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="john@company.com" type="email" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("clients.companyName")}</label>
              <input value={companyName} onChange={(e) => setCompanyName(e.target.value)} placeholder="Smith Stones LLC" className={inputCls} />
            </div>
            <div>
              <label className={labelCls}>{t("clients.country")}</label>
              <input value={country} onChange={(e) => setCountry(e.target.value)} placeholder="USA" className={inputCls} />
            </div>
          </div>

          {error && <div className="mt-3 rounded-lg bg-destructive-soft px-3 py-2.5 text-[12.5px] text-destructive">{error}</div>}

          <div className="mt-4 flex gap-2">
            <button onClick={handleSave} disabled={saving || !name.trim() || !email.trim()}
              className="h-11 rounded-xl bg-primary px-5 text-[14px] font-semibold text-white disabled:opacity-50">
              {saving ? t("clients.saving") : t("clients.save")}
            </button>
            <button onClick={() => setShowForm(false)} className="h-11 rounded-xl border border-input bg-white px-5 text-[14px] font-semibold text-foreground">
              {t("clients.cancel")}
            </button>
          </div>
          <p className="mt-2 text-caption text-muted-foreground">{t("clients.inviteNote")}</p>
        </div>
      )}

      {isLoading ? (
        <div className="space-y-2.5">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-[72px] animate-pulse rounded-xl bg-white/30" />)}</div>
      ) : clients.length === 0 ? (
        <div className="glass rounded-2xl p-10 text-center">
          <Users className="mx-auto h-10 w-10 text-muted-foreground" />
          <p className="mt-3 text-title text-foreground">{t("clients.emptyTitle")}</p>
          <p className="mt-1 text-body text-muted-foreground">{t("clients.emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2.5">
          {clients.map((c) => (
            <div key={c.id} className="glass group flex items-center gap-3 rounded-xl p-4">
              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-primary/10 text-[15px] font-bold text-primary">
                {c.name.charAt(0).toUpperCase()}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-[14px] font-bold text-foreground">{c.name}</span>
                  <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-semibold ${statusCls[c.status]}`}>
                    {t(`clients.status.${c.status}`)}
                  </span>
                </div>
                <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[12px] text-muted-foreground">
                  <span className="flex items-center gap-1"><Mail className="h-3 w-3" /> {c.email}</span>
                  {c.company_name && <span className="flex items-center gap-1"><Building2 className="h-3 w-3" /> {c.company_name}</span>}
                  {c.country && <span>{c.country}</span>}
                </div>
              </div>
              <button
                onClick={() => { if (confirm(t("clients.confirmDelete"))) deleteClient.mutate(c.id); }}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-muted-foreground opacity-0 transition-opacity hover:text-destructive group-hover:opacity-100"
                aria-label={t("clients.delete")}
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
