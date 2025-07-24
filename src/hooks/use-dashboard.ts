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

// Fetch dashboard data from API
const fetchDashboardData = async (): Promise<DashboardData> => {
  const response = await axios.get("/api/dashboard");
  return response.data;
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true, // Refetch when window gains focus to get latest data
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DashboardData) => {
      const response = await axios.patch("/api/dashboard", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the dashboard data
      queryClient.invalidateQueries({ queryKey: ["dashboard"] });
    },
  });
}; 