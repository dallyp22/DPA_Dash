import { Card } from "@/components/ui/card";
import { BudgetData } from "@/hooks/use-budget";

interface BudgetOverviewCardProps {
  budgetData: BudgetData;
}

export default function BudgetOverviewCard({ budgetData }: BudgetOverviewCardProps) {
  // Calculate totals
  const totalRevenueBudget = Object.values(budgetData.revenue).reduce((sum, item) => sum + item.fy2526Budget, 0);
  const totalRevenueActual = Object.values(budgetData.revenue).reduce((sum, item) => sum + item.fy2526Actuals, 0);
  const totalExpensesBudget = Object.values(budgetData.expenses).reduce((sum, item) => sum + item.fy2526Budget, 0);
  const totalExpensesActual = Object.values(budgetData.expenses).reduce((sum, item) => sum + item.fy2526Actuals, 0);
  
  const netOperatingIncomeBudget = totalRevenueBudget - totalExpensesBudget;
  const netOperatingIncomeActual = totalRevenueActual - totalExpensesActual;
  
  const interestExpenseBudget = budgetData.financials.interestExpense.fy2526Budget;
  const interestExpenseActual = budgetData.financials.interestExpense.fy2526Actuals;
  
  const earningsBeforeTaxesBudget = netOperatingIncomeBudget - interestExpenseBudget;
  const earningsBeforeTaxesActual = netOperatingIncomeActual - interestExpenseActual;
  
  const incomeTaxesBudget = budgetData.financials.incomeTaxes.fy2526Budget;
  const incomeTaxesActual = budgetData.financials.incomeTaxes.fy2526Actuals;
  
  const netEarningsBudget = earningsBeforeTaxesBudget - incomeTaxesBudget;
  const netEarningsActual = earningsBeforeTaxesActual - incomeTaxesActual;
  
  // Calculate variances
  const revenueVariance = totalRevenueActual - totalRevenueBudget;
  const expensesVariance = totalExpensesActual - totalExpensesBudget;
  const netVariance = netEarningsActual - netEarningsBudget;
  
  // Calculate percentages
  const revenueProgress = totalRevenueBudget > 0 ? (totalRevenueActual / totalRevenueBudget) * 100 : 0;
  const expenseProgress = totalExpensesBudget > 0 ? (totalExpensesActual / totalExpensesBudget) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-xl font-semibold text-white">
          {budgetData.fiscalYear} Financial Overview
        </h2>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-dpa-green/10 border border-dpa-green/30">
          <span className="text-lg">📈</span>
          <span className="text-dpa-green text-sm font-semibold">
            {netVariance >= 0 ? 'On Track' : 'Below Target'}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Revenue Section */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-lg text-dpa-cyan">Revenue</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Budget</span>
              <span className="text-dpa-cyan font-bold">
                ${totalRevenueBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Actual</span>
              <span className="text-white font-bold">
                ${totalRevenueActual.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-dpa-cyan to-dpa-green transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(revenueProgress, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">{revenueProgress.toFixed(1)}% of budget</span>
              <span className={`font-semibold ${revenueVariance >= 0 ? 'text-dpa-green' : 'text-red-400'}`}>
                {revenueVariance >= 0 ? '+' : ''}${revenueVariance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Expenses Section */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-lg text-orange-400">Expenses</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Budget</span>
              <span className="text-orange-400 font-bold">
                ${totalExpensesBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Actual</span>
              <span className="text-white font-bold">
                ${totalExpensesActual.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-orange-400 to-red-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(expenseProgress, 100)}%` }}
              ></div>
            </div>
            
            <div className="flex justify-between items-center text-xs">
              <span className="text-gray-400">{expenseProgress.toFixed(1)}% of budget</span>
              <span className={`font-semibold ${expensesVariance <= 0 ? 'text-dpa-green' : 'text-red-400'}`}>
                {expensesVariance >= 0 ? '+' : ''}${expensesVariance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Net Earnings Section */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-lg text-dpa-green">Net Earnings</h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Budget</span>
              <span className="text-dpa-green font-bold">
                ${netEarningsBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Actual</span>
              <span className={`font-bold ${netEarningsActual >= 0 ? 'text-white' : 'text-red-400'}`}>
                ${Math.abs(netEarningsActual).toLocaleString()}
                {netEarningsActual < 0 && ' loss'}
              </span>
            </div>
            
            <div className="p-3 rounded-lg bg-dpa-green/10 border border-dpa-green/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Variance</span>
                <span className={`font-bold ${netVariance >= 0 ? 'text-dpa-green' : 'text-red-400'}`}>
                  {netVariance >= 0 ? '+' : ''}${netVariance.toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats Footer */}
      <div className="mt-6 pt-6 border-t border-dpa-green/20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-xs">Operating Margin</p>
            <p className="text-dpa-cyan font-bold">
              {totalRevenueBudget > 0 ? ((netOperatingIncomeBudget / totalRevenueBudget) * 100).toFixed(1) : 0}%
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Revenue Achievement</p>
            <p className="text-dpa-green font-bold">
              {revenueProgress.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Expense Control</p>
            <p className={`font-bold ${expenseProgress <= 100 ? 'text-dpa-green' : 'text-red-400'}`}>
              {expenseProgress.toFixed(1)}%
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Net Margin</p>
            <p className="text-dpa-cyan font-bold">
              {totalRevenueBudget > 0 ? ((netEarningsBudget / totalRevenueBudget) * 100).toFixed(1) : 0}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
