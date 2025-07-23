import { Card } from "@/components/ui/card";

interface RevenueCardProps {
  target: number;
  current: number;
  milestones: {
    cash: number;
    escrow: number;
  };
}

export default function RevenueCard({ target, current, milestones }: RevenueCardProps) {
  const progress = (current / target) * 100;
  const cashProgress = (milestones.cash / target) * 100;
  const escrowProgress = (milestones.escrow / target) * 100;

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20 dpa-glow">
      <h2 className="font-orbitron text-lg font-semibold text-white mb-4">
        Revenue Target – ${target.toLocaleString()}
      </h2>
      
      <div className="space-y-4">
        <div className="text-right">
          <span className="text-dpa-cyan font-bold text-xl">
            ${current.toLocaleString()}
          </span>
          <span className="text-gray-400 text-sm ml-2">current</span>
        </div>
        
        <div className="relative">
          {/* Progress bar background */}
          <div className="h-4 rounded-full bg-gray-700/50 relative overflow-hidden">
            {/* Current progress */}
            <div
              className="h-full rounded-full bg-gradient-to-r from-dpa-cyan to-dpa-green transition-all duration-500 ease-out"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
            
            {/* Milestone markers */}
            <div
              className="absolute top-0 w-0.5 h-full bg-white/60"
              style={{ left: `${cashProgress}%` }}
            />
            <div
              className="absolute top-0 w-0.5 h-full bg-white/60"
              style={{ left: `${escrowProgress}%` }}
            />
          </div>
          
          {/* Milestone labels */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>$0</span>
            <span className="absolute transform -translate-x-1/2" style={{ left: `${cashProgress}%` }}>
              Cash ${milestones.cash.toLocaleString()}
            </span>
            <span className="absolute transform -translate-x-1/2" style={{ left: `${escrowProgress}%` }}>
              Escrow ${milestones.escrow.toLocaleString()}
            </span>
            <span>${target.toLocaleString()}</span>
          </div>
        </div>
        
        <div className="text-center">
          <span className="text-dpa-cyan font-bold text-lg">
            {progress.toFixed(1)}%
          </span>
          <span className="text-gray-400 text-sm ml-2">complete</span>
        </div>
      </div>
    </Card>
  );
} 