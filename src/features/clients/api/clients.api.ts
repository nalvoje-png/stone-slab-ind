import { supabase } from "@/lib/supabase";
import type { Client } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function listClients(companyId: string): Promise<Client[]> {
  const { data, error } = await db
    .from("clients")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export interface NewClientInput {
  company_id: string;
  name: string;
  email: string;
  company_name?: string;
  country?: string;
}

export async function createClient(input: NewClientInput): Promise<Client> {
  const { data, error } = await db.from("clients").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateClient(id: string, patch: Partial<NewClientInput> & { status?: string }): Promise<Client> {
  const { data, error } = await db.from("clients").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteClient(id: string) {
  const { error } = await db.from("clients").delete().eq("id", id);
  if (error) throw error;
}
