import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export interface LineItem {
  fy2324Actual: number;
  fy2425Actual: number;
  fy2526Budget: number;
  fy2526Actuals: number;
  monthlyActuals: number[]; // 12 months (Aug-Jul fiscal year)
}

export interface BudgetData {
  fiscalYear: string;
  revenue: {
    commissions: LineItem;
    buyersPremium: LineItem;
    listingFees: LineItem;
    advertisingRevenue: LineItem;
    variousFees: LineItem;
    saasRevenue: LineItem;
    otherRevenue: LineItem;
  };
  expenses: {
    badDebts: LineItem;
    advertisingLeadGen: LineItem;
    professionalFees: LineItem;
    travelMealsAuto: LineItem;
    payrollBenefits: LineItem;
    commissions: LineItem;
    rent: LineItem;
    taxesFees: LineItem;
    utilities: LineItem;
    bankCharges: LineItem;
    officeSupplyPostage: LineItem;
    rdIt: LineItem;
    hrCultureAdmin: LineItem;
    repairsMaintenance: LineItem;
    miscellaneous: LineItem;
    donations: LineItem;
    professionalInsurance: LineItem;
  };
  financials: {
    interestExpense: LineItem;
    incomeTaxes: LineItem;
  };
}

// Fetch budget data from API
const fetchBudgetData = async (): Promise<BudgetData> => {
  const response = await axios.get("/api/budget");
  return response.data;
};

export const useBudget = () => {
  return useQuery({
    queryKey: ["budget"],
    queryFn: fetchBudgetData,
    staleTime: 1000 * 60 * 5, // 5 minutes
    refetchOnWindowFocus: true,
  });
};

export const useUpdateBudget = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data: BudgetData) => {
      const response = await axios.patch("/api/budget", data);
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch the budget data
      queryClient.invalidateQueries({ queryKey: ["budget"] });
    },
  });
};
