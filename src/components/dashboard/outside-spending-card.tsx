import { Card } from "@/components/ui/card";

interface OutsideSpendingCardProps {
  items: Array<{
    label: string;
    amount: number;
  }>;
}

export default function OutsideSpendingCard({ items }: OutsideSpendingCardProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);
  
  // Colors for the spending items
  const colors = [
    'bg-blue-500',
    'bg-purple-500', 
    'bg-pink-500',
    'bg-orange-500',
    'bg-teal-500'
  ];

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-semibold text-white">
          Outside Spending
        </h2>
        <div className="text-right">
          <p className="text-dpa-cyan font-bold text-xl">
            ${total.toLocaleString()}
          </p>
          <p className="text-gray-400 text-xs">Total Spent</p>
        </div>
      </div>
      
      {/* Visual Progress Bars */}
      <div className="space-y-4 mb-6">
        {items.map((item, index) => {
          const percentage = total > 0 ? (item.amount / total) * 100 : 0;
          const colorClass = colors[index % colors.length];
          
          return (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${colorClass}`}></div>
                  <span className="text-gray-300 font-medium">{item.label}</span>
                </div>
                <div className="text-right">
                  <span className="text-dpa-cyan font-semibold">
                    ${item.amount.toLocaleString()}
                  </span>
                  <span className="text-gray-400 text-sm ml-2">
                    ({percentage.toFixed(1)}%)
                  </span>
                </div>
              </div>
              
              {/* Progress bar for each item */}
              <div className="w-full bg-gray-700/50 rounded-full h-2">
                <div
                  className={`h-2 rounded-full ${colorClass} transition-all duration-1000 ease-out`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* Summary Section */}
      <div className="border-t border-dpa-green/20 pt-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-orange-400"></div>
            <span className="text-gray-300 text-sm">
              {items.length} expense {items.length === 1 ? 'category' : 'categories'}
            </span>
          </div>
          <span className="text-gray-400 text-xs">
            Avg: ${(total / Math.max(items.length, 1)).toLocaleString()}
          </span>
        </div>
        
        {/* Quick insights */}
        {items.length > 0 && (
          <div className="mt-3 p-3 bg-dpa-green/10 rounded-lg border border-dpa-green/20">
            <p className="text-xs text-gray-300">
              <span className="font-semibold text-dpa-cyan">
                {items.reduce((max, item) => item.amount > max.amount ? item : max, items[0]).label}
              </span>
              {' '}is the largest expense category
            </p>
          </div>
        )}
      </div>
    </Card>
  );
} 