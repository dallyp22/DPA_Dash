"use client";

import { Suspense, useState } from "react";
import { useDashboard, useUpdateDashboard, DashboardData } from "@/hooks/use-dashboard";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function AdminPanelContent() {
  const { data, isLoading } = useDashboard();
  const updateDashboard = useUpdateDashboard();
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleUpdate = async (updates: Partial<DashboardData>) => {
    try {
      await updateDashboard.mutateAsync({ ...data, ...updates });
      setLastSaved(new Date());
    } catch (error) {
      console.error('Failed to update:', error);
    }
  };

  const handleInputChange = (field: keyof DashboardData, value: number) => {
    const updates = { [field]: value };
    handleUpdate(updates);
  };

  const handleNestedInputChange = (parentField: keyof DashboardData, childField: string, value: number) => {
    const currentValue = data?.[parentField] as Record<string, number>;
    const updates = {
      [parentField]: {
        ...currentValue,
        [childField]: value
      }
    };
    handleUpdate(updates);
  };

  const handleArrayItemChange = (field: keyof DashboardData, index: number, itemField: string, value: string | number) => {
    const currentArray = data?.[field] as Array<Record<string, string | number>>;
    const updatedArray = [...currentArray];
    updatedArray[index] = { ...updatedArray[index], [itemField]: value };
    handleUpdate({ [field]: updatedArray } as Partial<DashboardData>);
  };

  const addSpendingItem = () => {
    const newItem = { label: "New Item", amount: 0 };
    const updatedSpending = [...(data?.outsideSpending || []), newItem];
    handleUpdate({ outsideSpending: updatedSpending });
  };

  const removeSpendingItem = (index: number) => {
    const updatedSpending = data?.outsideSpending.filter((_, i) => i !== index) || [];
    handleUpdate({ outsideSpending: updatedSpending });
  };

  const addGoal = () => {
    const newGoal = { goal: "New Goal", status: "pending" as const };
    const updatedGoals = [...(data?.goals || []), newGoal];
    handleUpdate({ goals: updatedGoals });
  };

  const removeGoal = (index: number) => {
    const updatedGoals = data?.goals.filter((_, i) => i !== index) || [];
    handleUpdate({ goals: updatedGoals });
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpa-cyan mx-auto mb-4"></div>
          <p className="text-dpa-cyan font-orbitron">Loading Admin Panel...</p>
        </div>
      </div>
    );
  }

  if (!data) return <div>No data available</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <h1 className="font-orbitron text-3xl font-bold text-white">
          Admin Panel
        </h1>
        {lastSaved && (
          <p className="text-dpa-cyan text-sm">
            Last saved: {lastSaved.toLocaleTimeString()}
          </p>
        )}
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
              value={data.revenueTarget}
              onChange={(e) => handleInputChange('revenueTarget', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="revenueCurrent" className="text-gray-300">Current Revenue</Label>
            <Input
              id="revenueCurrent"
              type="number"
              value={data.revenueCurrent}
              onChange={(e) => handleInputChange('revenueCurrent', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="milestoneCash" className="text-gray-300">Cash Milestone</Label>
            <Input
              id="milestoneCash"
              type="number"
              value={data.milestones.cash}
              onChange={(e) => handleNestedInputChange('milestones', 'cash', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="milestoneEscrow" className="text-gray-300">Escrow Milestone</Label>
            <Input
              id="milestoneEscrow"
              type="number"
              value={data.milestones.escrow}
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
              value={data.ytd.revenue}
              onChange={(e) => handleNestedInputChange('ytd', 'revenue', Number(e.target.value))}
              className="bg-dpa-dark-pine border-dpa-green/30 text-white"
            />
          </div>
          <div>
            <Label htmlFor="ytdExpenses" className="text-gray-300">YTD Expenses</Label>
            <Input
              id="ytdExpenses"
              type="number"
              value={data.ytd.expenses}
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
          {data.outsideSpending.map((item, index) => (
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
          {data.goals.map((goal, index) => (
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