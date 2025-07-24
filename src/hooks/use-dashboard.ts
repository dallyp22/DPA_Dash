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

// localStorage key for dashboard data
const DASHBOARD_STORAGE_KEY = "dpa-dashboard-data";

// Helper functions for localStorage
const getStoredData = (): DashboardData | null => {
  if (typeof window === "undefined") return null;
  try {
    const stored = localStorage.getItem(DASHBOARD_STORAGE_KEY);
    return stored ? JSON.parse(stored) : null;
  } catch (error) {
    console.error("Error reading from localStorage:", error);
    return null;
  }
};

const setStoredData = (data: DashboardData): void => {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(DASHBOARD_STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Error writing to localStorage:", error);
  }
};

// Fetch dashboard data with localStorage fallback
const fetchDashboardData = async (): Promise<DashboardData> => {
  try {
    // First try to get data from localStorage
    const storedData = getStoredData();
    if (storedData) {
      return storedData;
    }

    // If no stored data, fetch from API
    const response = await axios.get("/api/dashboard");
    const apiData = response.data;
    
    // Store the API data in localStorage for future use
    setStoredData(apiData);
    
    return apiData;
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    throw error;
  }
};

export const useDashboard = () => {
  return useQuery({
    queryKey: ["dashboard"],
    queryFn: fetchDashboardData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useUpdateDashboard = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: DashboardData) => {
      // Save to localStorage immediately
      setStoredData(data);
      
      // Also send to API (for logging/debugging)
      try {
        await axios.patch("/api/dashboard", data);
      } catch (error) {
        console.warn("API update failed, but data saved to localStorage:", error);
      }
      
      return data;
    },
    onSuccess: (data) => {
      // Update the query cache with the new data
      queryClient.setQueryData(["dashboard"], data);
    },
  });
}; 