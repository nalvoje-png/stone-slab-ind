import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { signIn } from "../api/auth.api";

export function LoginPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit() {
    setError(null);
    setLoading(true);
    try {
      await signIn(email, password);
      navigate("/", { replace: true });
    } catch (e) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      setError((e as any)?.message ?? t("auth.error"));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-dvh">
      {/* Painel da marca */}
      <div className="relative hidden w-1/2 flex-col justify-between bg-brand p-12 lg:flex">
        <div className="flex items-center gap-2.5">
          <img src="/logo-icon.png" alt="" className="h-10 w-10 rounded-lg" />
          <span className="font-display text-2xl font-600 text-white">
            Stone Slab <span className="opacity-80">IND</span>
          </span>
        </div>
        <div>
          <h1 className="font-display text-4xl font-600 leading-tight text-white">
            {t("auth.heroTitle")}
          </h1>
          <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-white/70">
            {t("auth.heroTag")}
          </p>
        </div>
        <p className="text-[13px] text-white/60">© 2026 Stone Slab</p>
      </div>

      {/* Formulário */}
      <div className="flex w-full flex-col justify-center bg-background px-8 lg:w-1/2 lg:px-20">
        <div className="absolute right-6 top-6 flex overflow-hidden rounded-full border border-border">
          {(["pt", "en"] as const).map((lng) => (
            <button
              key={lng}
              onClick={() => i18n.changeLanguage(lng)}
              className={`px-3 py-1 text-[12px] font-semibold uppercase ${i18n.resolvedLanguage === lng ? "bg-secondary text-foreground" : "text-muted-foreground"}`}
            >
              {lng}
            </button>
          ))}
        </div>

        <div className="mx-auto w-full max-w-sm">
          <h2 className="font-display text-3xl font-600 text-foreground">{t("auth.signIn")}</h2>
          <p className="mt-1.5 text-body text-muted-foreground">{t("auth.signInSubtitle")}</p>

          <div className="mt-8 space-y-4">
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-foreground">{t("auth.email")}</label>
              <input
                type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                className="h-12 w-full rounded-full border border-input bg-card px-5 text-body text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="mb-1.5 block text-[13px] font-semibold text-foreground">{t("auth.password")}</label>
              <input
                type="password" value={password} onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                className="h-12 w-full rounded-full border border-input bg-card px-5 text-body text-foreground outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            {error && <p className="text-[13px] text-destructive">{error}</p>}

            <button
              onClick={handleSubmit} disabled={loading}
              className="h-12 w-full rounded-full bg-primary text-[15px] font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
            >
              {loading ? t("auth.signingIn") : t("auth.signIn")}
            </button>

            <p className="text-center text-[13px] text-muted-foreground">
              {t("auth.noAccount")}{" "}
              <button onClick={() => navigate("/signup")} className="font-semibold text-primary">{t("auth.createNow")}</button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
