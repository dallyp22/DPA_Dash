"use client";

import { Suspense, useState, useCallback, useEffect, useRef } from "react";
import { useDashboard, useUpdateDashboard, DashboardData } from "@/hooks/use-dashboard";
import { useBudget, useUpdateBudget, BudgetData, LineItem } from "@/hooks/use-budget";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function AdminPanelContent() {
  const { data, isLoading } = useDashboard();
  const updateDashboard = useUpdateDashboard();
  const { data: budgetData, isLoading: budgetLoading } = useBudget();
  const updateBudget = useUpdateBudget();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [budgetLastSaved, setBudgetLastSaved] = useState<Date | null>(null);
  const [localData, setLocalData] = useState<DashboardData | null>(null);
  const [localBudgetData, setLocalBudgetData] = useState<BudgetData | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isBudgetSaving, setIsBudgetSaving] = useState(false);
  const saveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const budgetSaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize local data when server data loads
  useEffect(() => {
    if (data && !localData) {
      setLocalData(data);
    }
  }, [data, localData]);

  // Initialize budget data when server data loads
  useEffect(() => {
    if (budgetData && !localBudgetData) {
      setLocalBudgetData(budgetData);
    }
  }, [budgetData, localBudgetData]);

  // Debounced save function
  const debouncedSave = useCallback(async (dataToSave: DashboardData) => {
    try {
      setIsSaving(true);
      await updateDashboard.mutateAsync(dataToSave);
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update:', error);
      // Revert to server data on error
      if (data) {
        setLocalData(data);
      }
    } finally {
      setIsSaving(false);
    }
  }, [updateDashboard, data]);

  // Debounced save function for budget
  const debouncedBudgetSave = useCallback(async (dataToSave: BudgetData) => {
    try {
      setIsBudgetSaving(true);
      await updateBudget.mutateAsync(dataToSave);
      setBudgetLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update budget:', error);
      // Revert to server data on error
      if (budgetData) {
        setLocalBudgetData(budgetData);
      }
    } finally {
      setIsBudgetSaving(false);
    }
  }, [updateBudget, budgetData]);

  // Update local state and schedule save
  const scheduleUpdate = useCallback((updates: Partial<DashboardData>) => {
    if (!localData) return;

    const updatedData = { ...localData, ...updates } as DashboardData;
    setLocalData(updatedData);

    // Clear existing timeout
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
    }

    // Schedule save after 1 second of inactivity
    saveTimeoutRef.current = setTimeout(() => {
      debouncedSave(updatedData);
    }, 1000);
  }, [localData, debouncedSave]);

  // Update budget state and schedule save
  const scheduleBudgetUpdate = useCallback((updates: Partial<BudgetData>) => {
    if (!localBudgetData) return;

    const updatedData = { ...localBudgetData, ...updates } as BudgetData;
    setLocalBudgetData(updatedData);

    // Clear existing timeout
    if (budgetSaveTimeoutRef.current) {
      clearTimeout(budgetSaveTimeoutRef.current);
    }

    // Schedule save after 1 second of inactivity
    budgetSaveTimeoutRef.current = setTimeout(() => {
      debouncedBudgetSave(updatedData);
    }, 1000);
  }, [localBudgetData, debouncedBudgetSave]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeoutRef.current) {
        clearTimeout(saveTimeoutRef.current);
      }
      if (budgetSaveTimeoutRef.current) {
        clearTimeout(budgetSaveTimeoutRef.current);
      }
    };
  }, []);

  const handleInputChange = useCallback((field: keyof DashboardData, value: number) => {
    const updates = { [field]: value };
    scheduleUpdate(updates);
  }, [scheduleUpdate]);

  const handleNestedInputChange = useCallback((parentField: keyof DashboardData, childField: string, value: number) => {
    if (!localData) return;
    const currentValue = localData[parentField] as Record<string, number>;
    const updates = {
      [parentField]: {
        ...currentValue,
        [childField]: value
      }
    };
    scheduleUpdate(updates);
  }, [localData, scheduleUpdate]);

  const handleArrayItemChange = useCallback((field: keyof DashboardData, index: number, itemField: string, value: string | number) => {
    if (!localData) return;
    const currentArray = localData[field] as Array<Record<string, string | number>>;
    const updatedArray = [...currentArray];
    updatedArray[index] = { ...updatedArray[index], [itemField]: value };
    scheduleUpdate({ [field]: updatedArray } as Partial<DashboardData>);
  }, [localData, scheduleUpdate]);

  const addSpendingItem = useCallback(() => {
    if (!localData) return;
    const newItem = { label: "New Item", amount: 0 };
    const updatedSpending = [...(localData.outsideSpending || []), newItem];
    scheduleUpdate({ outsideSpending: updatedSpending });
  }, [localData, scheduleUpdate]);

  const removeSpendingItem = useCallback((index: number) => {
    if (!localData) return;
    const updatedSpending = localData.outsideSpending.filter((_, i) => i !== index) || [];
    scheduleUpdate({ outsideSpending: updatedSpending });
  }, [localData, scheduleUpdate]);

  const addGoal = useCallback(() => {
    if (!localData) return;
    const newGoal = { goal: "New Goal", status: "pending" as const };
    const updatedGoals = [...(localData.goals || []), newGoal];
    scheduleUpdate({ goals: updatedGoals });
  }, [localData, scheduleUpdate]);

  const removeGoal = useCallback((index: number) => {
    if (!localData) return;
    const updatedGoals = localData.goals.filter((_, i) => i !== index) || [];
    scheduleUpdate({ goals: updatedGoals });
  }, [localData, scheduleUpdate]);

  // Manual save function
  const handleManualSave = useCallback(async () => {
    if (!localData) return;
    
    // Clear any pending debounced save
    if (saveTimeoutRef.current) {
      clearTimeout(saveTimeoutRef.current);
      saveTimeoutRef.current = null;
    }
    
    await debouncedSave(localData);
  }, [localData, debouncedSave]);

  // Budget monthly actual update function
  const handleBudgetMonthlyUpdate = useCallback((category: keyof BudgetData, lineItem: string, monthIndex: number, value: number) => {
    if (!localBudgetData) return;
    
    const categoryData = localBudgetData[category];
    if (typeof categoryData === 'object' && categoryData !== null && lineItem in categoryData) {
      const currentLineItem = (categoryData as Record<string, LineItem>)[lineItem];
      const updatedMonthlyActuals = [...currentLineItem.monthlyActuals];
      updatedMonthlyActuals[monthIndex] = value;
      
      // Calculate new total actuals
      const newActuals = updatedMonthlyActuals.reduce((sum, month) => sum + month, 0);
      
      const updatedLineItem = {
        ...currentLineItem,
        monthlyActuals: updatedMonthlyActuals,
        fy2526Actuals: newActuals
      };
      
      const updates = {
        [category]: {
          ...categoryData,
          [lineItem]: updatedLineItem
        }
      } as Partial<BudgetData>;
      
      scheduleBudgetUpdate(updates);
    }
  }, [localBudgetData, scheduleBudgetUpdate]);

  // Manual budget save function
  const handleManualBudgetSave = useCallback(async () => {
    if (!localBudgetData) return;
    
    // Clear any pending debounced save
    if (budgetSaveTimeoutRef.current) {
      clearTimeout(budgetSaveTimeoutRef.current);
      budgetSaveTimeoutRef.current = null;
    }
    
    await debouncedBudgetSave(localBudgetData);
  }, [localBudgetData, debouncedBudgetSave]);

  if (isLoading || budgetLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpa-cyan mx-auto mb-4"></div>
          <p className="text-dpa-cyan font-orbitron">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!localData || !localBudgetData) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-orbitron text-3xl font-bold text-white">
          Admin Panel
        </h1>
        <div className="flex items-center gap-4">
          {/* Save Status */}
          <div className="flex items-center gap-4">
            {/* Dashboard Save Status */}
            <div className="flex items-center gap-2">
              {isSaving && (
                <div className="flex items-center gap-2 text-dpa-cyan">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dpa-cyan"></div>
                  <span className="text-sm">Saving Dashboard...</span>
                </div>
              )}
              {saveTimeoutRef.current && !isSaving && (
                <div className="flex items-center gap-2 text-yellow-400">
                  <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Dashboard pending...</span>
                </div>
              )}
              {lastSaved && !saveTimeoutRef.current && !isSaving && (
                <p className="text-dpa-green text-sm">
                  ✓ Dashboard: {lastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>

            {/* Budget Save Status */}
            <div className="flex items-center gap-2">
              {isBudgetSaving && (
                <div className="flex items-center gap-2 text-dpa-cyan">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-dpa-cyan"></div>
                  <span className="text-sm">Saving Budget...</span>
                </div>
              )}
              {budgetSaveTimeoutRef.current && !isBudgetSaving && (
                <div className="flex items-center gap-2 text-orange-400">
                  <div className="w-2 h-2 bg-orange-400 rounded-full animate-pulse"></div>
                  <span className="text-sm">Budget pending...</span>
                </div>
              )}
              {budgetLastSaved && !budgetSaveTimeoutRef.current && !isBudgetSaving && (
                <p className="text-dpa-green text-sm">
                  ✓ Budget: {budgetLastSaved.toLocaleTimeString()}
                </p>
              )}
            </div>
          </div>
          
          {/* Manual Save Buttons */}
          <div className="flex gap-2">
            <Button 
              onClick={handleManualSave}
              disabled={isSaving}
              className="bg-dpa-green hover:bg-dpa-green/80 text-white"
            >
              {isSaving ? 'Saving...' : 'Save Dashboard'}
            </Button>
            <Button 
              onClick={handleManualBudgetSave}
              disabled={isBudgetSaving}
              className="bg-orange-500 hover:bg-orange-600 text-white"
            >
              {isBudgetSaving ? 'Saving...' : 'Save Budget'}
            </Button>
          </div>
        </div>
      </div>

      {/* Revenue Settings */}
      <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20">
        <h2 className="font-orbitron text-xl font-semibold text-white mb-4">
          Revenue Settings
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="revenueTarget" className="text-gray-300">Revenue Target</Label>
            <Input
              id="revenueTarget"
              type="number"
              value={localData.revenueTarget}
              onChange={(e) => handleInputChange('revenueTarget', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="revenueCurrent" className="text-gray-300">Current Revenue</Label>
            <Input
              id="revenueCurrent"
              type="number"
              value={localData.revenueCurrent}
              onChange={(e) => handleInputChange('revenueCurrent', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="milestoneCash" className="text-gray-300">Cash Milestone</Label>
            <Input
              id="milestoneCash"
              type="number"
              value={localData.milestones.cash}
              onChange={(e) => handleNestedInputChange('milestones', 'cash', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="milestoneEscrow" className="text-gray-300">Escrow Milestone</Label>
            <Input
              id="milestoneEscrow"
              type="number"
              value={localData.milestones.escrow}
              onChange={(e) => handleNestedInputChange('milestones', 'escrow', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
        </div>
      </Card>

      {/* YTD Settings */}
      <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20">
        <h2 className="font-orbitron text-xl font-semibold text-white mb-4">
          YTD Profit & Loss
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="ytdRevenue" className="text-gray-300">YTD Revenue</Label>
            <Input
              id="ytdRevenue"
              type="number"
              value={localData.ytd.revenue}
              onChange={(e) => handleNestedInputChange('ytd', 'revenue', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="ytdExpenses" className="text-gray-300">YTD Expenses</Label>
            <Input
              id="ytdExpenses"
              type="number"
              value={localData.ytd.expenses}
              onChange={(e) => handleNestedInputChange('ytd', 'expenses', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
        </div>
      </Card>

      {/* Outside Spending */}
      <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-orbitron text-xl font-semibold text-white">
            Outside Spending
          </h2>
          <Button onClick={addSpendingItem} className="bg-dpa-green hover:bg-dpa-green/80">
            Add Item
          </Button>
        </div>
        <div className="space-y-3">
          {localData.outsideSpending.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-gray-300">Label</Label>
                <Input
                  value={item.label}
                  onChange={(e) => handleArrayItemChange('outsideSpending', index, 'label', e.target.value)}
                  className="bg-dpa-dark-pine border-dpa-green/30 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Amount</Label>
                <Input
                  type="number"
                  value={item.amount}
                  onChange={(e) => handleArrayItemChange('outsideSpending', index, 'amount', Number(e.target.value))}
                  className="bg-dpa-dark-pine border-dpa-green/30 text-white"
                />
              </div>
              <Button
                onClick={() => removeSpendingItem(index)}
                variant="destructive"
                className="h-10"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Goals */}
      <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-orbitron text-xl font-semibold text-white">
            Goals
          </h2>
          <Button onClick={addGoal} className="bg-dpa-green hover:bg-dpa-green/80">
            Add Goal
          </Button>
        </div>
        <div className="space-y-3">
          {localData.goals.map((goal, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
              <div>
                <Label className="text-gray-300">Goal</Label>
                <Input
                  value={goal.goal}
                  onChange={(e) => handleArrayItemChange('goals', index, 'goal', e.target.value)}
                  className="bg-dpa-dark-pine border-dpa-green/30 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <select
                  value={goal.status}
                  onChange={(e) => handleArrayItemChange('goals', index, 'status', e.target.value)}
                  className="flex h-10 w-full rounded-md border border-dpa-green/30 bg-dpa-dark-pine px-3 py-2 text-sm text-white"
                >
                  <option value="pending">Pending</option>
                  <option value="in-progress">In Progress</option>
                  <option value="completed">Completed</option>
                </select>
              </div>
              <Button
                onClick={() => removeGoal(index)}
                variant="destructive"
                className="h-10"
              >
                Remove
              </Button>
            </div>
          ))}
        </div>
      </Card>

      {/* Budget Administration */}
      <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-orange-400/20">
        <h2 className="font-orbitron text-xl font-semibold text-white mb-4 flex items-center gap-2">
          <span>📊</span>
          Budget Monthly Actuals - {localBudgetData.fiscalYear}
        </h2>
        <p className="text-gray-400 text-sm mb-6">
          Enter monthly actual values to track performance against budget. Values are automatically totaled for YTD actuals.
        </p>

        {/* Month Headers */}
        <div className="grid grid-cols-13 gap-2 mb-4 text-xs text-gray-400">
          <div className="col-span-1 font-medium">Line Item</div>
          {['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'].map((month) => (
            <div key={month} className="text-center font-medium">{month}</div>
          ))}
        </div>

        {/* Revenue Section */}
        <div className="mb-8">
          <h3 className="font-orbitron text-lg text-dpa-cyan mb-4 flex items-center gap-2">
            <span>💰</span>
            Revenue
          </h3>
          <div className="space-y-3">
            {Object.entries(localBudgetData.revenue).map(([key, lineItem]) => {
              const label = {
                commissions: "Commissions",
                buyersPremium: "Buyers Premium",
                listingFees: "Listing Fees",
                advertisingRevenue: "Advertising Revenue",
                variousFees: "Various Fees",
                saasRevenue: "SaaS Revenue",
                otherRevenue: "Other Revenue"
              }[key] || key;

              return (
                <div key={key} className="grid grid-cols-13 gap-2 items-center">
                  <div className="col-span-1 text-white text-sm font-medium">{label}</div>
                  {lineItem.monthlyActuals.map((value, monthIndex) => (
                    <Input
                      key={monthIndex}
                      type="number"
                      value={value}
                      onChange={(e) => handleBudgetMonthlyUpdate('revenue', key, monthIndex, Number(e.target.value) || 0)}
                      className="bg-dpa-dark-pine border-dpa-cyan/30 text-white text-xs h-8"
                      placeholder="0"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Expenses Section */}
        <div className="mb-8">
          <h3 className="font-orbitron text-lg text-orange-400 mb-4 flex items-center gap-2">
            <span>📈</span>
            Operating Expenses
          </h3>
          <div className="space-y-3 max-h-96 overflow-y-auto">
            {Object.entries(localBudgetData.expenses).map(([key, lineItem]) => {
              const label = {
                badDebts: "Bad Debts",
                advertisingLeadGen: "Advertising & Lead Gen",
                professionalFees: "Professional Fees",
                travelMealsAuto: "Travel, Meals & Auto",
                payrollBenefits: "Payroll & Benefits",
                commissions: "Commissions",
                rent: "Rent",
                taxesFees: "Taxes & Fees",
                utilities: "Utilities",
                bankCharges: "Bank Charges",
                officeSupplyPostage: "Office Supply & Postage",
                rdIt: "R&D / IT",
                hrCultureAdmin: "HR & Culture / Admin",
                repairsMaintenance: "Repairs & Maintenance",
                miscellaneous: "Miscellaneous",
                donations: "Donations",
                professionalInsurance: "Professional Insurance"
              }[key] || key;

              return (
                <div key={key} className="grid grid-cols-13 gap-2 items-center">
                  <div className="col-span-1 text-white text-sm font-medium">{label}</div>
                  {lineItem.monthlyActuals.map((value, monthIndex) => (
                    <Input
                      key={monthIndex}
                      type="number"
                      value={value}
                      onChange={(e) => handleBudgetMonthlyUpdate('expenses', key, monthIndex, Number(e.target.value) || 0)}
                      className="bg-dpa-dark-pine border-orange-400/30 text-white text-xs h-8"
                      placeholder="0"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        {/* Financial Items Section */}
        <div>
          <h3 className="font-orbitron text-lg text-purple-400 mb-4 flex items-center gap-2">
            <span>🏦</span>
            Financial Items
          </h3>
          <div className="space-y-3">
            {Object.entries(localBudgetData.financials).map(([key, lineItem]) => {
              const label = {
                interestExpense: "Interest Expense",
                incomeTaxes: "Income Taxes"
              }[key] || key;

              return (
                <div key={key} className="grid grid-cols-13 gap-2 items-center">
                  <div className="col-span-1 text-white text-sm font-medium">{label}</div>
                  {lineItem.monthlyActuals.map((value, monthIndex) => (
                    <Input
                      key={monthIndex}
                      type="number"
                      value={value}
                      onChange={(e) => handleBudgetMonthlyUpdate('financials', key, monthIndex, Number(e.target.value) || 0)}
                      className="bg-dpa-dark-pine border-purple-400/30 text-white text-xs h-8"
                      placeholder="0"
                    />
                  ))}
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 p-4 bg-dpa-green/10 rounded-lg border border-dpa-green/20">
          <p className="text-xs text-gray-300">
            <span className="font-semibold text-dpa-cyan">Budget Tip:</span>
            {' '}Monthly actuals are automatically summed to calculate YTD actuals. Changes save automatically after 1 second of inactivity.
          </p>
        </div>
      </Card>
    </div>
  );
}

export default function AdminPanel() {
  return (
    <div className="p-6">
      <Suspense fallback={
        <div className="flex items-center justify-center min-h-[50vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpa-cyan mx-auto mb-4"></div>
            <p className="text-dpa-cyan font-orbitron">Loading...</p>
          </div>
        </div>
      }>
        <AdminPanelContent />
      </Suspense>
    </div>
  );
} 