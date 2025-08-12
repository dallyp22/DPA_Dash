"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useDashboard } from "@/hooks/use-dashboard";
import RevenueCard from "@/components/dashboard/revenue-card";
import OutsideSpendingCard from "@/components/dashboard/outside-spending-card";
import GoalsCard from "@/components/dashboard/goals-card";
import YtdCard from "@/components/dashboard/ytd-card";

export default function Home() {
  const { data, isLoading, error, refetch } = useDashboard();
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setIsRefreshing(true);
      refetch().finally(() => {
        setLastUpdated(new Date());
        setIsRefreshing(false);
      });
    }, 30000);

    return () => clearInterval(interval);
  }, [refetch]);

  // Manual refresh
  const handleRefresh = async () => {
    setIsRefreshing(true);
    await refetch();
    setLastUpdated(new Date());
    setIsRefreshing(false);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="relative">
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-dpa-cyan mx-auto mb-4"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-8 h-8 bg-dpa-green rounded-full animate-pulse"></div>
            </div>
          </div>
          <p className="text-dpa-cyan font-orbitron text-lg">Initializing Command Center...</p>
          <p className="text-gray-400 text-sm mt-2">Loading real-time data</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-orbitron text-xl mb-2">System Alert</p>
          <p className="text-gray-400 mb-4">Unable to establish connection to command center</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-2 bg-dpa-green hover:bg-dpa-green/80 text-white rounded-lg font-orbitron transition-colors"
          >
            Retry Connection
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center">
          <div className="text-6xl mb-4">📊</div>
          <p className="text-gray-400 font-orbitron">No data streams available</p>
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
    <div className="min-h-screen bg-gradient-to-br from-dpa-dark-pine to-dpa-pine-light">
      {/* Dashboard Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-orbitron text-2xl font-bold text-white mb-2">
              Mission Control Dashboard
            </h1>
            <p className="text-gray-400 text-sm">
              Real-time operational intelligence • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`px-4 py-2 rounded-lg border border-dpa-green/30 text-dpa-cyan hover:bg-dpa-green/20 transition-colors font-orbitron text-sm flex items-center gap-2 ${
                isRefreshing ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              <span className={`text-lg ${isRefreshing ? 'animate-spin' : ''}`}>
                🔄
              </span>
              {isRefreshing ? 'Syncing...' : 'Refresh'}
            </button>
            
            {/* Status Indicator */}
            <div className="flex items-center gap-2 px-3 py-2 bg-dpa-green/10 rounded-lg border border-dpa-green/30">
              <div className="w-2 h-2 bg-dpa-green rounded-full animate-pulse"></div>
              <span className="text-dpa-green-readable text-xs font-semibold">LIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Dashboard Grid */}
      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="grid gap-6 grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 auto-rows-fr">
          {/* Priority KPI - YTD Profit & Loss (moved to top-left) */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <YtdCard ytd={data.ytd} />
          </motion.div>
          
          {/* Revenue Target */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <RevenueCard
              target={data.revenueTarget}
              current={data.revenueCurrent}
              milestones={data.milestones}
            />
          </motion.div>
          
          {/* Outside Spending */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <OutsideSpendingCard items={data.outsideSpending} />
          </motion.div>
          
          {/* Goals & Objectives */}
          <motion.div variants={itemVariants} className="xl:col-span-1">
            <GoalsCard goals={data.goals} />
          </motion.div>
        </div>

        {/* Quick Stats Footer */}
        <motion.div 
          variants={itemVariants}
          className="mt-8 p-4 bg-dpa-pine-light/50 rounded-lg border border-dpa-green/20"
        >
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-gray-400 text-xs">Revenue Progress</p>
              <p className="text-dpa-cyan font-bold">
                {((data.revenueCurrent / data.revenueTarget) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Profit Margin</p>
              <p className="text-dpa-green-readable font-bold">
                {data.ytd.revenue > 0 ? (((data.ytd.revenue - data.ytd.expenses) / data.ytd.revenue) * 100).toFixed(1) : 0}%
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Goals Complete</p>
              <p className="text-dpa-cyan font-bold">
                {data.goals.filter(g => g.status === 'completed').length}/{data.goals.length}
              </p>
            </div>
            <div>
              <p className="text-gray-400 text-xs">Total Spending</p>
              <p className="text-red-400 font-bold">
                ${data.outsideSpending.reduce((sum, item) => sum + item.amount, 0).toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}
