import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signUp } from "../api/auth.api";

export function SignupPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signUp(email, password, { company_name: companyName });
      navigate("/", { replace: true });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? t("auth.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="" className="h-10 w-10 rounded-lg" />
          <span className="font-display text-2xl font-600 text-foreground">
            Stone Slab <span className="text-primary">IND</span>
          </span>
        </div>

        <h2 className="font-display text-3xl font-600 text-foreground">{t("auth.signUp")}</h2>
        <p className="mt-1.5 text-body text-muted-foreground">{t("auth.signUpSubtitle")}</p>

        <div className="mt-8 space-y-4">
          <Field label={t("auth.companyName")} value={companyName} onChange={setCompanyName} />
          <Field label={t("auth.email")} value={email} onChange={setEmail} type="email" />
          <Field label={t("auth.password")} value={password} onChange={setPassword} type="password" />

          {error && <p className="text-[13px] text-destructive">{error}</p>}

          <button
            onClick={handleSubmit} disabled={loading}
            className="h-12 w-full rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
          >
            {loading ? t("auth.creating") : t("auth.create")}
          </button>

          <p className="text-center text-[13px] text-muted-foreground">
            {t("auth.haveAccount")}{" "}
            <button onClick={() => navigate("/login")} className="font-semibold text-primary">{t("auth.signInNow")}</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange, type = "text" }: { label: string; value: string; onChange: (v: string) => void; type?: string }) {
  return (
    <div>
      <label className="mb-1.5 block text-[13px] font-semibold text-foreground">{label}</label>
      <input
        type={type} value={value} onChange={(e) => onChange(e.target.value)}
        className="h-12 w-full rounded-full border border-input bg-card px-5 text-body text-foreground outline-none focus:ring-2 focus:ring-ring"
      />
    </div>
  );
}
