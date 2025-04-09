import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { type InsertContactMessage } from "@shared/schema";

export function useSendContactMessage() {
  return useMutation({
    mutationFn: async (message: InsertContactMessage) => {
      const res = await apiRequest('POST', '/api/contact-messages', message);
      return res.json();
    }
  });
}
