// Conversão de preço entre m² e pé² (1 m² = 10,7639 pé²)
export const SQM_TO_SQFT = 10.7639;

export function pricePerSqmToSqft(pricePerSqm: number): number {
  return +(pricePerSqm / SQM_TO_SQFT).toFixed(2);
}
export function pricePerSqftToSqm(pricePerSqft: number): number {
  return +(pricePerSqft * SQM_TO_SQFT).toFixed(2);
}
export function usd(value: number | null | undefined): string {
  if (value == null) return "—";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(value);
}
