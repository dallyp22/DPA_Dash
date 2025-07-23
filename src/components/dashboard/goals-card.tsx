import { Card } from "@/components/ui/card";

interface GoalsCardProps {
  goals: Array<{
    goal: string;
    status: "pending" | "in-progress" | "completed";
  }>;
}

const statusConfig = {
  pending: {
    color: "bg-gray-500",
    bgColor: "bg-gray-500/10",
    borderColor: "border-gray-500/30",
    textColor: "text-gray-400",
    label: "Pending",
    icon: "⏸️",
    progress: 0
  },
  "in-progress": {
    color: "bg-dpa-cyan",
    bgColor: "bg-dpa-cyan/10", 
    borderColor: "border-dpa-cyan/30",
    textColor: "text-dpa-cyan",
    label: "In Progress",
    icon: "🚀",
    progress: 50
  },
  completed: {
    color: "bg-dpa-green",
    bgColor: "bg-dpa-green/10",
    borderColor: "border-dpa-green/30", 
    textColor: "text-dpa-green",
    label: "Completed",
    icon: "✅",
    progress: 100
  },
};

export default function GoalsCard({ goals }: GoalsCardProps) {
  const totalGoals = goals.length;
  const completedGoals = goals.filter(goal => goal.status === "completed").length;
  const inProgressGoals = goals.filter(goal => goal.status === "in-progress").length;
  const overallProgress = totalGoals > 0 ? (completedGoals / totalGoals) * 100 : 0;

  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine via-dpa-pine-light to-dpa-pine-lighter border border-dpa-green/30 shadow-xl hover:shadow-2xl transition-all duration-300 dpa-glow">
      <div className="flex items-center justify-between mb-6">
        <h2 className="font-orbitron text-lg font-semibold text-white">
          Goals & Objectives
        </h2>
        <div className="text-right">
          <p className="text-dpa-cyan font-bold text-xl">
            {completedGoals}/{totalGoals}
          </p>
          <p className="text-gray-400 text-xs">Completed</p>
        </div>
      </div>

      {/* Overall Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-2">
          <span className="text-gray-300 text-sm">Overall Progress</span>
          <span className="text-dpa-cyan font-semibold text-sm">
            {overallProgress.toFixed(0)}%
          </span>
        </div>
        <div className="w-full bg-gray-700/50 rounded-full h-2">
          <div
            className="h-2 rounded-full bg-gradient-to-r from-dpa-cyan to-dpa-green transition-all duration-1000 ease-out"
            style={{ width: `${overallProgress}%` }}
          ></div>
        </div>
      </div>
      
      {/* Goals List */}
      <div className="space-y-4 mb-6">
        {goals.map((goal, index) => {
          const config = statusConfig[goal.status];
          
          return (
            <div key={index} className={`p-4 rounded-lg border ${config.borderColor} ${config.bgColor} transition-all duration-300 hover:scale-[1.02]`}>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 mt-1">
                  <span className="text-lg">{config.icon}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-white font-medium text-sm leading-relaxed">
                    {goal.goal}
                  </p>
                  <div className="flex items-center justify-between mt-3">
                    <span className={`text-xs font-semibold px-2 py-1 rounded-full ${config.color} text-white`}>
                      {config.label}
                    </span>
                    
                    {/* Individual progress bar */}
                    <div className="flex items-center gap-2 flex-1 ml-3">
                      <div className="w-full bg-gray-700/50 rounded-full h-1.5">
                        <div
                          className={`h-1.5 rounded-full ${config.color} transition-all duration-1000 ease-out`}
                          style={{ width: `${config.progress}%` }}
                        ></div>
                      </div>
                      <span className={`text-xs ${config.textColor} min-w-[2rem]`}>
                        {config.progress}%
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {goals.length === 0 && (
        <div className="text-center py-8">
          <div className="text-4xl mb-2">🎯</div>
          <p className="text-gray-400 text-sm">No goals set yet</p>
          <p className="text-gray-500 text-xs mt-1">Add goals to track progress</p>
        </div>
      )}

      {/* Summary Statistics */}
      {totalGoals > 0 && (
        <div className="border-t border-dpa-green/20 pt-4">
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs">Completed</p>
              <p className="text-dpa-green font-bold text-lg">{completedGoals}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">In Progress</p>
              <p className="text-dpa-cyan font-bold text-lg">{inProgressGoals}</p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Pending</p>
              <p className="text-gray-500 font-bold text-lg">{totalGoals - completedGoals - inProgressGoals}</p>
            </div>
          </div>
        </div>
      )}
    </Card>
  );
} 