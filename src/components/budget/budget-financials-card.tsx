import { Card } from "@/components/ui/card";
import { LineItem } from "@/hooks/use-budget";

interface BudgetFinancialsCardProps {
  financials: {
    interestExpense: LineItem;
    incomeTaxes: LineItem;
  };
}

export default function BudgetFinancialsCard({ financials }: BudgetFinancialsCardProps) {
  const interestBudget = financials.interestExpense.fy2526Budget;
  const interestActual = financials.interestExpense.fy2526Actuals;
  const interestVariance = interestActual - interestBudget;
  const interestProgress = interestBudget > 0 ? (interestActual / interestBudget) * 100 : 0;

  const taxesBudget = financials.incomeTaxes.fy2526Budget;
  const taxesActual = financials.incomeTaxes.fy2526Actuals;
  const taxesVariance = taxesActual - taxesBudget;
  const taxesProgress = taxesBudget > 0 ? (taxesActual / taxesBudget) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">🏦</span>
          <h2 className="font-orbitron text-lg font-semibold text-white">
            Financial Items
          </h2>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30">
          <span className="text-purple-400 text-sm font-semibold">
            Below Operating
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Interest Expense */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-base text-red-400 flex items-center gap-2">
            <span>💸</span>
            Interest Expense
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Budget</span>
              <span className="text-red-400 font-bold">
                ${interestBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Actual</span>
              <span className="text-white font-bold">
                ${interestActual.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-red-400 to-red-600 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(interestProgress, 100)}%` }}
              ></div>
            </div>
            
            <div className="p-3 rounded-lg bg-red-400/10 border border-red-400/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Variance</span>
                <span className={`font-bold ${interestVariance <= 0 ? 'text-dpa-green-readable' : 'text-red-400'}`}>
                  {interestVariance >= 0 ? '+' : ''}${interestVariance.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {interestProgress.toFixed(1)}% of budget
                {interestVariance <= 0 ? ' (savings!)' : ' (over budget)'}
              </div>
            </div>
          </div>
        </div>

        {/* Income Taxes */}
        <div className="space-y-4">
          <h3 className="font-orbitron text-base text-yellow-400 flex items-center gap-2">
            <span>🏛️</span>
            Income Taxes
          </h3>
          
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Budget</span>
              <span className="text-yellow-400 font-bold">
                ${taxesBudget.toLocaleString()}
              </span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-gray-300 text-sm">Actual</span>
              <span className="text-white font-bold">
                ${taxesActual.toLocaleString()}
              </span>
            </div>
            
            <div className="w-full bg-gray-700/50 rounded-full h-3">
              <div
                className="h-3 rounded-full bg-gradient-to-r from-yellow-400 to-orange-400 transition-all duration-1000 ease-out"
                style={{ width: `${Math.min(taxesProgress, 100)}%` }}
              ></div>
            </div>
            
            <div className="p-3 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
              <div className="flex justify-between items-center">
                <span className="text-gray-300 text-sm">Variance</span>
                <span className={`font-bold ${taxesVariance <= 0 ? 'text-dpa-green-readable' : 'text-red-400'}`}>
                  {taxesVariance >= 0 ? '+' : ''}${taxesVariance.toLocaleString()}
                </span>
              </div>
              <div className="text-xs text-gray-400 mt-1">
                {taxesProgress.toFixed(1)}% of budget
                {taxesVariance <= 0 ? ' (savings!)' : ' (additional tax)'}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Financial Impact Summary */}
      <div className="mt-6 pt-6 border-t border-dpa-green/20">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Total Financial Items</p>
            <p className="text-red-400 font-bold text-lg">
              ${(interestBudget + taxesBudget).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">Budget</p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Actual Impact</p>
            <p className="text-white font-bold text-lg">
              ${(interestActual + taxesActual).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">Year to Date</p>
          </div>
          
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Net Variance</p>
            <p className={`font-bold text-lg ${
              (interestVariance + taxesVariance) <= 0 ? 'text-dpa-green-readable' : 'text-red-400'
            }`}>
              {(interestVariance + taxesVariance) >= 0 ? '+' : ''}${(interestVariance + taxesVariance).toLocaleString()}
            </p>
            <p className="text-xs text-gray-400">
              {(interestVariance + taxesVariance) <= 0 ? 'Favorable' : 'Unfavorable'}
            </p>
          </div>
        </div>

        {/* Additional insights */}
        <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
          <p className="text-xs text-gray-300">
            <span className="font-semibold text-purple-400">Financial Note:</span>
            {' '}These items appear below operating income and represent financing costs and tax obligations.
            {(interestVariance + taxesVariance) <= 0 && ' Current performance shows favorable variance - great financial discipline!'}
          </p>
        </div>
      </div>
    </Card>
  );
}
