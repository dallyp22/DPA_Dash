import { NextRequest, NextResponse } from "next/server";

// Fallback data matching the DashboardData interface
const fallbackData = {
  revenueTarget: 500000,
  revenueCurrent: 287500,
  milestones: {
    cash: 150000,
    escrow: 137500
  },
  outsideSpending: [
    { label: "Marketing", amount: 28750 },
    { label: "Software Licenses", amount: 22100 },
    { label: "Professional Services", amount: 45300 },
    { label: "Equipment", amount: 18600 }
  ],
  ytd: {
    revenue: 287500,
    expenses: 114750
  },
  goals: [
    { goal: "Increase market share by 15%", status: "in-progress" as const },
    { goal: "Launch new product line", status: "completed" as const },
    { goal: "Reduce operational costs by 10%", status: "in-progress" as const },
    { goal: "Expand to 3 new markets", status: "pending" as const },
    { goal: "Achieve 95% customer satisfaction", status: "in-progress" as const }
  ]
};

export async function GET() {
  try {
    // Always use fallback data for now (no database dependency)
    return NextResponse.json(fallbackData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(fallbackData);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    // Simulate success but don't persist changes (no database)
    console.log("Dashboard update received:", body);
    return NextResponse.json({ ok: true, warning: "Changes not persisted - database not connected" });
  } catch (error) {
    console.error("Error updating dashboard data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
} 