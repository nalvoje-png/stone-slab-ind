import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/features/auth/hooks/useAuth";
import { listClients, createClient, updateClient, deleteClient, type NewClientInput } from "../api/clients.api";

export function useClients() {
  const { user } = useAuth();
  return useQuery({
    queryKey: ["clients", user?.id],
    enabled: Boolean(user?.id),
    queryFn: () => listClients(user!.id),
  });
}

export function useCreateClient() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (input: Omit<NewClientInput, "company_id">) => createClient({ ...input, company_id: user!.id }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients", user?.id] }),
  });
}

export function useUpdateClient() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, patch }: { id: string; patch: Partial<NewClientInput> & { status?: string } }) => updateClient(id, patch),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients", user?.id] }),
  });
}

export function useDeleteClient() {
  const { user } = useAuth();
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => deleteClient(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["clients", user?.id] }),
  });
}
