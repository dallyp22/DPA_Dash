import { Card } from "@/components/ui/card";

interface GoalsCardProps {
  goals: Array<{
    goal: string;
    status: "pending" | "in-progress" | "completed";
  }>;
}

const statusColors = {
  pending: "bg-gray-500",
  "in-progress": "bg-dpa-cyan",
  completed: "bg-dpa-green",
};

const statusLabels = {
  pending: "Pending",
  "in-progress": "In Progress",
  completed: "Completed",
};

export default function GoalsCard({ goals }: GoalsCardProps) {
  return (
    <Card className="p-6 bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light border-dpa-green/20 dpa-glow">
      <h2 className="font-orbitron text-lg font-semibold text-white mb-4">
        Goals
      </h2>
      
      <div className="space-y-4">
        {goals.map((goal, index) => (
          <div key={index} className="space-y-2">
            <div className="flex items-start gap-3">
              <div className={`w-3 h-3 rounded-full ${statusColors[goal.status]} mt-1 flex-shrink-0`} />
              <div className="flex-1">
                <p className="text-white text-sm">{goal.goal}</p>
                <p className="text-gray-400 text-xs">{statusLabels[goal.status]}</p>
              </div>
            </div>
          </div>
        ))}
        
        {goals.length === 0 && (
          <p className="text-gray-400 text-center py-4">No goals set</p>
        )}
      </div>
    </Card>
  );
} 