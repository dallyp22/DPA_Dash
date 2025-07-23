import { Card } from "@/components/ui/card";

interface OutsideSpendingCardProps {
  items: Array<{
    label: string;
    amount: number;
  }>;
}

export default function OutsideSpendingCard({ items }: OutsideSpendingCardProps) {
  const total = items.reduce((sum, item) => sum + item.amount, 0);

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20 dpa-glow">
      <h2 className="font-orbitron text-lg font-semibold text-white mb-4">
        Outside Spending
      </h2>
      
      <div className="space-y-3">
        {items.map((item, index) => (
          <div key={index} className="flex justify-between items-center">
            <span className="text-gray-300">{item.label}</span>
            <span className="text-dpa-cyan font-semibold">
              ${item.amount.toLocaleString()}
            </span>
          </div>
        ))}
        
        <div className="border-t border-dpa-green/30 pt-3 mt-4">
          <div className="flex justify-between items-center font-bold">
            <span className="text-white font-orbitron">Total</span>
            <span className="text-dpa-cyan text-xl">
              ${total.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </Card>
  );
} 