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

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20 dpa-glow">
      <h2 className="font-orbitron text-lg font-semibold text-white mb-4">
        YTD Profit and Loss
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Revenue</span>
          <span className="text-dpa-cyan font-semibold text-lg">
            ${ytd.revenue.toLocaleString()}
          </span>
        </div>
        
        <div className="flex justify-between items-center">
          <span className="text-gray-300">Expenses</span>
          <span className="text-red-400 font-semibold text-lg">
            ${ytd.expenses.toLocaleString()}
          </span>
        </div>
        
        <div className="border-t border-dpa-green/30 pt-4">
          <div className="flex justify-between items-center">
            <span className="text-white font-orbitron font-semibold">Profit</span>
            <span className={`font-bold text-xl ${profit >= 0 ? 'text-dpa-green' : 'text-red-400'}`}>
              ${profit.toLocaleString()}
            </span>
          </div>
          
          <div className="mt-2 text-center">
            <span className="text-gray-400 text-sm">Margin: </span>
            <span className={`font-semibold ${profitMargin >= 0 ? 'text-dpa-cyan' : 'text-red-400'}`}>
              {profitMargin.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 