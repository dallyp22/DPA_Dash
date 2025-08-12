import { Card } from "@/components/ui/card";

interface YtdCardProps {
  ytd: {
    revenue: number;
    expenses: number;
  };
}

export default function YtdCard({ ytd }: YtdCardProps) {
  const profit = ytd.revenue - ytd.expenses;
  const profitMargin = ytd.revenue > 0 ? (profit / ytd.revenue) * 100 : 0;
  const expenseRatio = ytd.revenue > 0 ? (ytd.expenses / ytd.revenue) * 100 : 0;
  
  // Determine profit status
  const marginStatus = profitMargin >= 40 ? 'excellent' : profitMargin >= 20 ? 'good' : profitMargin >= 0 ? 'poor' : 'negative';

  const statusConfig = {
    excellent: { color: 'text-emerald-400', bgColor: 'bg-emerald-400/10', icon: '📈' },
    good: { color: 'text-dpa-green-readable', bgColor: 'bg-dpa-green/10', icon: '✅' },
    poor: { color: 'text-yellow-400', bgColor: 'bg-yellow-400/10', icon: '⚠️' },
    negative: { color: 'text-red-400', bgColor: 'bg-red-400/10', icon: '📉' }
  };

  const config = statusConfig[marginStatus];

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-semibold text-white">
          YTD Financial Summary
        </h2>
        <div className={`flex items-center gap-2 px-3 py-1 rounded-full ${config.bgColor}`}>
          <span className="text-lg">{config.icon}</span>
          <span className={`text-sm font-semibold ${config.color}`}>
            {marginStatus.charAt(0).toUpperCase() + marginStatus.slice(1)}
          </span>
        </div>
      </div>
      
      {/* Revenue Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-dpa-cyan"></div>
            <span className="text-gray-300 text-sm font-medium">Revenue</span>
          </div>
          <span className="text-dpa-cyan font-bold text-xl">
            ${ytd.revenue.toLocaleString()}
          </span>
        </div>
        
        {/* Revenue Bar */}
        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
          <div 
            className="h-2 rounded-full bg-dpa-cyan transition-all duration-1000 ease-out"
            style={{ width: '100%' }}
          ></div>
        </div>
      </div>
      
      {/* Expenses Section */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <span className="text-gray-300 text-sm font-medium">Expenses</span>
          </div>
          <span className="text-red-400 font-bold text-xl">
            ${ytd.expenses.toLocaleString()}
          </span>
        </div>
        
        {/* Expenses Bar (relative to revenue) */}
        <div className="w-full bg-gray-700/50 rounded-full h-2 mb-2">
          <div 
            className="h-2 rounded-full bg-red-400 transition-all duration-1000 ease-out"
            style={{ width: `${Math.min(expenseRatio, 100)}%` }}
          ></div>
        </div>
        <div className="text-right">
          <span className="text-gray-400 text-xs">
            {expenseRatio.toFixed(1)}% of revenue
          </span>
        </div>
      </div>
      
      {/* Profit Section */}
      <div className="border-t border-dpa-green/20 pt-6 mb-6">
        <div className="flex justify-between items-center mb-4">
          <div className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${profit >= 0 ? 'bg-dpa-green' : 'bg-red-400'}`}></div>
            <span className="text-white font-orbitron font-semibold">Net Profit</span>
          </div>
          <span className={`font-bold text-2xl ${profit >= 0 ? 'text-dpa-green-readable' : 'text-red-400'}`}>
            ${Math.abs(profit).toLocaleString()}
            {profit < 0 && <span className="text-red-400 ml-1">loss</span>}
          </span>
        </div>
        
        {/* Profit Margin Visualization */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Profit Margin</p>
            <p className={`font-bold text-lg ${config.color}`}>
              {profitMargin.toFixed(1)}%
            </p>
          </div>
          <div className="text-center">
            <p className="text-gray-400 text-xs mb-1">Efficiency</p>
            <p className={`font-bold text-lg ${expenseRatio <= 60 ? 'text-dpa-green-readable' : expenseRatio <= 80 ? 'text-yellow-400' : 'text-red-400'}`}>
              {expenseRatio <= 60 ? 'High' : expenseRatio <= 80 ? 'Medium' : 'Low'}
            </p>
          </div>
        </div>
      </div>
      
      {/* Financial Health Insights */}
      <div className={`p-4 rounded-lg ${config.bgColor} border border-current/20`}>
        <div className="flex items-start gap-3">
          <span className="text-lg">{config.icon}</span>
          <div>
            <p className={`text-sm font-medium ${config.color} mb-1`}>
              Financial Health Assessment
            </p>
            <p className="text-gray-300 text-xs">
              {profitMargin >= 40 && "Excellent profitability! Your business is highly efficient."}
              {profitMargin >= 20 && profitMargin < 40 && "Good profit margins. Consider optimizing expenses for better results."}
              {profitMargin >= 0 && profitMargin < 20 && "Low profit margins. Focus on cost reduction or revenue growth."}
              {profitMargin < 0 && "Operating at a loss. Immediate action needed to improve financial position."}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
} 