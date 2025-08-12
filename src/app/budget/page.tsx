"use client";

import { motion } from "framer-motion";
import { useState, useEffect } from "react";
import { useBudget } from "@/hooks/use-budget";
import BudgetOverviewCard from "@/components/budget/budget-overview-card";
import BudgetCategoryCard from "@/components/budget/budget-category-card";
import BudgetFinancialsCard from "@/components/budget/budget-financials-card";

export default function BudgetPage() {
  const { data, isLoading, error, refetch } = useBudget();
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
          <p className="text-dpa-green-readable font-raleway text-lg">Loading Budget Data...</p>
          <p className="text-gray-400 text-sm mt-2">Analyzing financial performance</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[70vh]">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-4">⚠️</div>
          <p className="text-red-400 font-raleway text-xl mb-2">Budget System Alert</p>
          <p className="text-gray-400 mb-4">Unable to connect to budget database</p>
          <button 
            onClick={handleRefresh}
            className="px-6 py-2 bg-dpa-green hover:bg-dpa-green/80 text-white rounded-lg font-raleway transition-colors"
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
          <p className="text-gray-400 font-raleway">No budget data available</p>
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
      {/* Budget Header */}
      <div className="p-6 pb-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="font-raleway text-2xl font-bold text-white mb-2">
              Financial Command Center
            </h1>
            <p className="text-gray-400 text-sm">
              {data.fiscalYear} Budget Analysis • Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            {/* Refresh Button */}
            <button
              onClick={handleRefresh}
              disabled={isRefreshing}
              className={`px-4 py-2 rounded-lg border border-dpa-green/30 text-dpa-green-readable hover:bg-dpa-green/20 transition-colors font-raleway text-sm flex items-center gap-2 ${
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

      {/* Budget Dashboard Grid */}
      <motion.div 
        className="p-6"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Overview Card - Full Width */}
        <motion.div variants={itemVariants} className="mb-6">
          <BudgetOverviewCard budgetData={data} />
        </motion.div>

        {/* Revenue and Expenses Grid */}
        <div className="grid gap-6 grid-cols-1 xl:grid-cols-2 mb-6">
          <motion.div variants={itemVariants}>
            <BudgetCategoryCard 
              title="Revenue Streams" 
              data={data.revenue} 
              type="revenue"
              icon="💰"
            />
          </motion.div>
          
          <motion.div variants={itemVariants}>
            <BudgetCategoryCard 
              title="Operating Expenses" 
              data={data.expenses} 
              type="expenses"
              icon="📊"
            />
          </motion.div>
        </div>

        {/* Financials Card */}
        <motion.div variants={itemVariants}>
          <BudgetFinancialsCard financials={data.financials} />
        </motion.div>
      </motion.div>
    </div>
  );
}
