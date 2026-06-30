import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { Offer } from '../types/recruitment';
import { demoStore } from '../data/mockRecruitmentData';

export type CreateOfferInput = Omit<Offer, 'id' | 'createdAt'>;
export type UpdateOfferInput = Partial<CreateOfferInput>;

export function useOffers(applicantId?: string) {
  return useQuery({
    queryKey: ['offers', applicantId],
    queryFn: async () => {
      const endpoint = applicantId
        ? `/recruitment/offers?applicantId=${applicantId}`
        : '/recruitment/offers';
      const response = await api.get<{ offers: Offer[] }>(endpoint);
      if (!response.error) return response.data?.offers ?? [];
      return applicantId
        ? demoStore.offers.filter((o) => o.applicantId === applicantId)
        : [...demoStore.offers];
    },
  });
}

export function useCreateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: CreateOfferInput) => {
      const response = await api.post<Offer>(
        '/recruitment/offers',
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      const newOffer: Offer = {
        ...data,
        id: `of-${Date.now()}`,
        createdAt: new Date().toISOString(),
      };
      demoStore.offers.unshift(newOffer);
      return newOffer;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });
}

export function useUpdateOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: UpdateOfferInput }) => {
      const response = await api.put<Offer>(
        `/recruitment/offers/${id}`,
        data as Record<string, unknown>
      );
      if (!response.error) return response.data!;
      const idx = demoStore.offers.findIndex((o) => o.id === id);
      if (idx !== -1) demoStore.offers[idx] = { ...demoStore.offers[idx], ...data };
      return demoStore.offers[idx];
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });
}

export function useDeleteOffer() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const response = await api.delete(`/recruitment/offers/${id}`);
      if (!response.error) return id;
      demoStore.offers = demoStore.offers.filter((o) => o.id !== id);
      return id;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['offers'] }),
  });
}
