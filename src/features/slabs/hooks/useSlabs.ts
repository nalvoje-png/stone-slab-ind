import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  listSlabs, createSlab, createSlabsBatch, updateSlab, deleteSlab,
  type NewSlabInput, type BatchSlabCommon, type BatchSlabItem,
} from "../api/slabs.api";

export function useSlabs(materialId: string | undefined) {
  return useQuery({
    queryKey: ["slabs", materialId],
    enabled: Boolean(materialId),
    queryFn: () => listSlabs(materialId!),
  });
}

export function useCreateSlab(materialId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: NewSlabInput) => createSlab(input),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slabs", materialId] }),
  });
}

export function useCreateSlabsBatch(materialId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ common, items }: { common: BatchSlabCommon; items: BatchSlabItem[] }) =>
      createSlabsBatch(common, items),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slabs", materialId] }),
  });
}

export function useUpdateSlab(materialId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewSlabInput> & { status?: string } }) =>
      updateSlab(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slabs", materialId] }),
  });
}

export function useDeleteSlab(materialId: string) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteSlab(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["slabs", materialId] }),
  });
}
