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
