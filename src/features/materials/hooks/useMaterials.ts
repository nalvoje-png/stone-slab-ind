import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import {
  listMaterials, createMaterial, updateMaterial, deleteMaterial,
  listFinishes, createFinish, deleteFinish,
  type NewMaterialInput,
} from "../api/materials.api";

export function useMaterials() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["materials", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => listMaterials(user!.id),
  });
}

export function useCreateMaterial() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<NewMaterialInput, "company_id">) =>
      createMaterial({ ...input, company_id: user!.id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materials", user?.id] }),
  });
}

export function useUpdateMaterial() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewMaterialInput> }) =>
      updateMaterial(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materials", user?.id] }),
  });
}

export function useDeleteMaterial() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteMaterial(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["materials", user?.id] }),
  });
}

export function useFinishes() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["finishes", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => listFinishes(user!.id),
  });
}

export function useCreateFinish() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (name: string) => createFinish(user!.id, name),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finishes", user?.id] }),
  });
}

export function useDeleteFinish() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteFinish(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["finishes", user?.id] }),
  });
}
