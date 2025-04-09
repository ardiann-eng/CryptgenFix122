import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Member, type InsertMember } from "@shared/schema";

export function useMembers() {
  const query = useQuery({
    queryKey: ['/api/members'],
  });

  const membersData = query.data as Member[] | undefined;

  const coreMembers = membersData?.filter(member => 
    member.role === 'president' || member.role === 'secretary' || member.role === 'treasurer'
  ) || [];

  const regularMembers = membersData?.filter(member => 
    member.role === 'member'
  ) || [];

  return {
    ...query,
    coreMembers,
    regularMembers,
    allMembers: membersData || []
  };
}

export function useMember(id: number) {
  return useQuery({
    queryKey: [`/api/members/${id}`],
  });
}

export function useCreateMember() {
  return useMutation({
    mutationFn: async (member: InsertMember) => {
      const res = await apiRequest('POST', '/api/members', member);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
    },
  });
}

export function useUpdateMember(id: number) {
  return useMutation({
    mutationFn: async (member: Partial<InsertMember>) => {
      const res = await apiRequest('PUT', `/api/members/${id}`, member);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
      queryClient.invalidateQueries({ queryKey: [`/api/members/${id}`] });
    },
  });
}

export function useDeleteMember() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/members/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/members'] });
    },
  });
}
