import { supabase } from "@/lib/supabase";
import type { Material, Finish } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

// ===== ACABAMENTOS =====
export async function listFinishes(companyId: string): Promise<Finish[]> {
  const { data, error } = await db
    .from("finishes")
    .select("*")
    .eq("company_id", companyId)
    .order("name");
  if (error) throw error;
  return data ?? [];
}

export async function createFinish(companyId: string, name: string): Promise<Finish> {
  const { data, error } = await db
    .from("finishes")
    .insert({ company_id: companyId, name: name.trim() })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteFinish(id: string) {
  const { error } = await db.from("finishes").delete().eq("id", id);
  if (error) throw error;
}

// ===== MATERIAIS =====
export async function listMaterials(companyId: string): Promise<Material[]> {
  const { data, error } = await db
    .from("materials")
    .select("*")
    .eq("company_id", companyId)
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export interface NewMaterialInput {
  company_id: string;
  name: string;
  thickness?: string;
  finish?: string;
  cover_path?: string;
  price_sqm?: number;
  price_sqft?: number;
}

export async function createMaterial(input: NewMaterialInput): Promise<Material> {
  const { data, error } = await db.from("materials").insert(input).select().single();
  if (error) throw error;
  return data;
}

export async function updateMaterial(id: string, patch: Partial<NewMaterialInput>): Promise<Material> {
  const { data, error } = await db.from("materials").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteMaterial(id: string) {
  const { error } = await db.from("materials").delete().eq("id", id);
  if (error) throw error;
}

// ===== UPLOAD =====
export async function uploadMaterialPhoto(file: File, companyId: string): Promise<string> {
  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${companyId}/${crypto.randomUUID()}.${ext}`;
  const { error } = await db.storage.from("materials-media").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;
  return path;
}

export function materialPhotoUrl(path: string | null): string {
  if (!path) return "";
  if (path.startsWith("http")) return path;
  return db.storage.from("materials-media").getPublicUrl(path).data.publicUrl;
}
