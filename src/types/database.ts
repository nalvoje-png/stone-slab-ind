export interface Finish {
  id: string;
  company_id: string;
  name: string;
  created_at: string;
}

export interface Material {
  id: string;
  company_id: string;
  name: string;
  thickness: string | null;
  finish: string | null;
  cover_path: string | null;
  price_sqm: number | null;
  price_sqft: number | null;
  created_at: string;
}

export type SlabStatus = "disponivel" | "reservada" | "vendida";

export interface Slab {
  id: string;
  company_id: string;
  material_id: string;
  code: string;
  photo_path: string | null;
  length_m: number | null;
  height_m: number | null;
  price_sqm: number | null;
  price_sqft: number | null;
  status: SlabStatus;
  created_at: string;
}
