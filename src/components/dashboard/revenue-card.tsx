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
  
  // Calculate the circumference for the circular progress
  const radius = 45;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (progress / 100) * circumference;

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="font-orbitron text-lg font-semibold text-white mb-1">
            Revenue Target
          </h2>
          <p className="text-dpa-green-readable font-bold text-2xl">
            ${target.toLocaleString()}
          </p>
        </div>
        
        {/* Circular Progress Indicator */}
        <div className="relative w-24 h-24">
          <svg className="w-24 h-24 transform -rotate-90" viewBox="0 0 100 100">
            {/* Background circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="rgba(255,255,255,0.1)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <circle
              cx="50"
              cy="50"
              r={radius}
              stroke="url(#gradient)"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={circumference}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className="transition-all duration-1000 ease-out"
            />
            <defs>
              <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#11C2AC" />
                <stop offset="100%" stopColor="#04652A" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {progress.toFixed(1)}%
            </span>
          </div>
        </div>
      </div>
      
      {/* Current Progress */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Current Revenue</span>
          <span className="text-dpa-green-readable font-bold text-lg">
            ${current.toLocaleString()}
          </span>
        </div>
        
        {/* Linear progress bar for milestones */}
        <div className="relative">
          <div className="h-3 rounded-full bg-gray-700/50 relative overflow-hidden">
            {/* Current progress */}
            <div
              className="h-full rounded-full bg-dpa-green-readable transition-all duration-1000 ease-out shadow-lg"
              style={{ width: `${Math.min(progress, 100)}%` }}
            />
          </div>
          
          {/* Milestone markers */}
          <div className="flex justify-between text-xs text-gray-400 mt-2">
            <span>$0</span>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-yellow-400 mb-1"></div>
              <span className="whitespace-nowrap">Cash: ${milestones.cash.toLocaleString()}</span>
            </div>
            <div className="flex flex-col items-center">
              <div className="w-0.5 h-2 bg-blue-400 mb-1"></div>
              <span className="whitespace-nowrap">Escrow: ${milestones.escrow.toLocaleString()}</span>
            </div>
            <span>${target.toLocaleString()}</span>
          </div>
        </div>
      </div>
      
      {/* Status Indicator */}
      <div className="flex items-center justify-between pt-4 border-t border-dpa-green/20">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-2 rounded-full ${progress >= 50 ? 'bg-green-400' : progress >= 25 ? 'bg-yellow-400' : 'bg-red-400'}`}></div>
          <span className="text-gray-300 text-sm">
            {progress >= 50 ? 'On Track' : progress >= 25 ? 'Behind Target' : 'Critical'}
          </span>
        </div>
        <span className="text-gray-400 text-xs">
          ${(target - current).toLocaleString()} remaining
        </span>
      </div>
    </Card>
  );
} 