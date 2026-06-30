import { supabase } from "@/lib/supabase";
import { uploadMaterialPhoto } from "@/features/materials/api/materials.api";
import type { Slab } from "@/types/database";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const db = supabase as any;

export async function listSlabs(materialId: string): Promise<Slab[]> {
  const { data, error } = await db
    .from("slabs")
    .select("*")
    .eq("material_id", materialId)
    .order("code");
  if (error) throw error;
  return data ?? [];
}

export interface NewSlabInput {
  company_id: string;
  material_id: string;
  code: string;
  photo_path?: string;
  length_m?: number;
  height_m?: number;
  price_sqm?: number;
  price_sqft?: number;
}

export async function createSlab(input: NewSlabInput): Promise<Slab> {
  const { data, error } = await db.from("slabs").insert(input).select().single();
  if (error) throw error;
  return data;
}

// Criação em lote: várias chapas com mesmas características, cada uma com código e foto próprios.
export interface BatchSlabItem {
  code: string;
  file?: File | null;
}
export interface BatchSlabCommon {
  company_id: string;
  material_id: string;
  length_m?: number;
  height_m?: number;
  price_sqm?: number;
  price_sqft?: number;
}

export async function createSlabsBatch(common: BatchSlabCommon, items: BatchSlabItem[]): Promise<number> {
  // Sobe as fotos (quando houver) e monta os registros
  const rows: NewSlabInput[] = [];
  for (const item of items) {
    if (!item.code.trim()) continue;
    let photo_path: string | undefined;
    if (item.file) {
      photo_path = await uploadMaterialPhoto(item.file, common.company_id);
    }
    rows.push({
      company_id: common.company_id,
      material_id: common.material_id,
      code: item.code.trim(),
      photo_path,
      length_m: common.length_m,
      height_m: common.height_m,
      price_sqm: common.price_sqm,
      price_sqft: common.price_sqft,
    });
  }
  if (rows.length === 0) return 0;
  const { error } = await db.from("slabs").insert(rows);
  if (error) throw error;
  return rows.length;
}

export async function updateSlab(id: string, patch: Partial<NewSlabInput> & { status?: string }): Promise<Slab> {
  const { data, error } = await db.from("slabs").update(patch).eq("id", id).select().single();
  if (error) throw error;
  return data;
}

export async function deleteSlab(id: string) {
  const { error } = await db.from("slabs").delete().eq("id", id);
  if (error) throw error;
}
