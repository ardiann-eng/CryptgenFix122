import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { type Announcement, type InsertAnnouncement, type Event, type InsertEvent } from "@shared/schema";

// Announcements hooks
export function useAnnouncements() {
  return useQuery<Announcement[]>({
    queryKey: ['/api/announcements'],
  });
}

export function useAnnouncement(id: number) {
  return useQuery<Announcement>({
    queryKey: [`/api/announcements/${id}`],
  });
}

export function useCreateAnnouncement() {
  return useMutation({
    mutationFn: async (announcement: InsertAnnouncement) => {
      const res = await apiRequest('POST', '/api/announcements', announcement);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    },
  });
}

export function useUpdateAnnouncement(id: number) {
  return useMutation({
    mutationFn: async (announcement: Partial<InsertAnnouncement>) => {
      const res = await apiRequest('PUT', `/api/announcements/${id}`, announcement);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
      queryClient.invalidateQueries({ queryKey: [`/api/announcements/${id}`] });
    },
  });
}

export function useDeleteAnnouncement() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/announcements/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/announcements'] });
    },
  });
}

// Events hooks
export function useEvents() {
  return useQuery<Event[]>({
    queryKey: ['/api/events'],
  });
}

export function useEvent(id: number) {
  return useQuery<Event>({
    queryKey: [`/api/events/${id}`],
  });
}

export function useCreateEvent() {
  return useMutation({
    mutationFn: async (event: InsertEvent) => {
      const res = await apiRequest('POST', '/api/events', event);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
  });
}

export function useUpdateEvent(id: number) {
  return useMutation({
    mutationFn: async (event: Partial<InsertEvent>) => {
      const res = await apiRequest('PUT', `/api/events/${id}`, event);
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
      queryClient.invalidateQueries({ queryKey: [`/api/events/${id}`] });
    },
  });
}

export function useDeleteEvent() {
  return useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/events/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/events'] });
    },
  });
}
