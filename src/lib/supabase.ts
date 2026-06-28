import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

export const isConfigured = Boolean(url && anonKey);

// Não lança erro fatal se faltar config — mostra a tela de config.
export const supabase = createClient(url ?? "https://placeholder.supabase.co", anonKey ?? "placeholder");
