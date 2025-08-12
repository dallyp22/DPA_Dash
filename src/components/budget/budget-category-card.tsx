import { Card } from "@/components/ui/card";
import { LineItem } from "@/hooks/use-budget";

interface BudgetCategoryCardProps {
  title: string;
  data: Record<string, LineItem>;
  type: 'revenue' | 'expenses';
  icon: string;
}

// Human-readable labels for the line items
const lineItemLabels: Record<string, string> = {
  commissions: "Commissions",
  buyersPremium: "Buyers Premium",
  listingFees: "Listing Fees",
  advertisingRevenue: "Advertising Revenue",
  variousFees: "Various Fees",
  saasRevenue: "SaaS Revenue",
  otherRevenue: "Other Revenue",
  badDebts: "Bad Debts",
  advertisingLeadGen: "Advertising & Lead Gen",
  professionalFees: "Professional Fees",
  travelMealsAuto: "Travel, Meals & Auto",
  payrollBenefits: "Payroll & Benefits",
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
  professionalInsurance: "Professional Insurance",
};

export default function BudgetCategoryCard({ title, data, type, icon }: BudgetCategoryCardProps) {
  const isRevenue = type === 'revenue';
  const primaryColor = isRevenue ? 'dpa-cyan' : 'orange-400';
  const bgColor = isRevenue ? 'bg-dpa-cyan/10' : 'bg-orange-400/10';
  const borderColor = isRevenue ? 'border-dpa-cyan/30' : 'border-orange-400/30';
  
  // Calculate totals
  const totalBudget = Object.values(data).reduce((sum, item) => sum + item.fy2526Budget, 0);
  const totalActual = Object.values(data).reduce((sum, item) => sum + item.fy2526Actuals, 0);
  const totalVariance = totalActual - totalBudget;
  const totalProgress = totalBudget > 0 ? (totalActual / totalBudget) * 100 : 0;

  // Sort items by budget amount (largest first)
  const sortedItems = Object.entries(data).sort(([,a], [,b]) => b.fy2526Budget - a.fy2526Budget);

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{icon}</span>
          <h2 className="font-orbitron text-lg font-semibold text-white">
            {title}
          </h2>
        </div>
        <div className="text-right">
          <p className={`text-${primaryColor} font-bold text-xl`}>
            ${totalActual.toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs">
            of ${totalBudget.toLocaleString()} budget
          </p>
        </div>
      </div>

      {/* Overall Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Overall Progress</span>
          <span className={`text-${primaryColor} font-semibold text-sm`}>
            {totalProgress.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className={`h-2 rounded-full transition-all duration-1000 ease-out ${
              isRevenue 
                ? 'bg-gradient-to-r from-dpa-cyan to-dpa-green' 
                : 'bg-gradient-to-r from-orange-400 to-red-400'
            }`}
            style={{ width: `${Math.min(totalProgress, 100)}%` }}
          ></div>
        </div>
        <div className="flex justify-between items-center mt-1">
          <span className="text-gray-400 text-xs">
            Variance: 
            <span className={`ml-1 font-semibold ${
              (isRevenue && totalVariance >= 0) || (!isRevenue && totalVariance <= 0) 
                ? 'text-dpa-green' 
                : 'text-red-400'
            }`}>
              {totalVariance >= 0 ? '+' : ''}${totalVariance.toLocaleString()}
            </span>
          </span>
        </div>
      </div>

      {/* Line Items */}
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedItems.map(([key, item]) => {
          const progress = item.fy2526Budget > 0 ? (item.fy2526Actuals / item.fy2526Budget) * 100 : 0;
          const variance = item.fy2526Actuals - item.fy2526Budget;
          const label = lineItemLabels[key] || key;
          
          return (
            <div key={key} className={`p-3 rounded-lg ${bgColor} border ${borderColor} transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex justify-between items-start mb-2">
                <span className="text-white font-medium text-sm">
                  {label}
                </span>
                <div className="text-right">
                  <span className="text-white font-semibold">
                    ${item.fy2526Actuals.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-xs ml-2">
                    / ${item.fy2526Budget.toLocaleString()}
                  </span>
                </div>
              </div>
              
              {/* Individual progress bar */}
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                    <div
                      className={`h-1.5 rounded-full transition-all duration-1000 ease-out ${
                        isRevenue 
                          ? 'bg-dpa-cyan' 
                          : 'bg-orange-400'
                      }`}
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    ></div>
                  </div>
                </div>
                <span className={`text-xs font-semibold min-w-[3rem] text-${primaryColor}`}>
                  {progress.toFixed(0)}%
                </span>
              </div>
              
              {/* Variance indicator */}
              {Math.abs(variance) > 0 && (
                <div className="mt-2 text-xs">
                  <span className="text-gray-400">Variance: </span>
                  <span className={`font-semibold ${
                    (isRevenue && variance >= 0) || (!isRevenue && variance <= 0) 
                      ? 'text-dpa-green' 
                      : 'text-red-400'
                  }`}>
                    {variance >= 0 ? '+' : ''}${variance.toLocaleString()}
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="mt-6 pt-4 border-t border-dpa-green/20">
        <div className="grid grid-cols-3 gap-4 text-center">
          <div>
            <p className="text-gray-400 text-xs">Budget</p>
            <p className={`text-${primaryColor} font-bold text-sm`}>
              ${totalBudget.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Actual</p>
            <p className="text-white font-bold text-sm">
              ${totalActual.toLocaleString()}
            </p>
          </div>
          <div>
            <p className="text-gray-400 text-xs">Achievement</p>
            <p className={`font-bold text-sm ${
              (isRevenue && totalProgress >= 100) || (!isRevenue && totalProgress <= 100) 
                ? 'text-dpa-green' 
                : 'text-yellow-400'
            }`}>
              {totalProgress.toFixed(1)}%
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}
