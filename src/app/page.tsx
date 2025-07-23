"use client";

import { motion } from "framer-motion";
import { useDashboard } from "@/hooks/use-dashboard";
import RevenueCard from "@/components/dashboard/revenue-card";
import OutsideSpendingCard from "@/components/dashboard/outside-spending-card";
import GoalsCard from "@/components/dashboard/goals-card";
import YtdCard from "@/components/dashboard/ytd-card";

export default function Home() {
  const { data, isLoading, error } = useDashboard();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-dpa-cyan mx-auto mb-4"></div>
          <p className="text-dpa-cyan font-orbitron">Loading Command Center...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-red-400 font-orbitron mb-2">System Error</p>
          <p className="text-gray-400">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[50vh]">
        <div className="text-center">
          <p className="text-gray-400 font-orbitron">No data available</p>
        </div>
      </div>
    );
  }

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        delayChildren: 0.1,
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        duration: 0.5
      }
    }
  };

  return (
    <motion.div 
      className="p-6"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4">
        <motion.div variants={itemVariants}>
          <RevenueCard
            target={data.revenueTarget}
            current={data.revenueCurrent}
            milestones={data.milestones}
          />
        </motion.div>
        <motion.div variants={itemVariants}>
          <OutsideSpendingCard items={data.outsideSpending} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <GoalsCard goals={data.goals} />
        </motion.div>
        <motion.div variants={itemVariants}>
          <YtdCard ytd={data.ytd} />
        </motion.div>
      </div>
    </motion.div>
  );
}
