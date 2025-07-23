import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface DashboardData {
  revenueTarget: number;
  revenueCurrent: number;
  milestones: {
    cash: number;
    escrow: number;
  };
  outsideSpending: Array<{
    label: string;
    amount: number;
  }>;
  ytd: {
    revenue: number;
    expenses: number;
  };
  goals: Array<{
    goal: string;
    status: "pending" | "in-progress" | "completed";
  }>;
}

export function useDashboard() {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: async (): Promise<DashboardData> => {
      const response = await axios.get("/api/dashboard");
      return response.data;
    },
  });
}

export function useUpdateDashboard() {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: async (data: Partial<DashboardData>) => {
      const response = await axios.patch("/api/dashboard", data);
      return response.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
} 