import { NextRequest, NextResponse } from "next/server";

// Simple in-memory storage for demo purposes
let dashboardData = {
  revenue: {
    target: 500000,
    current: 287500,
    milestones: [
      { name: "Q1 Target", target: 125000, current: 125000, completed: true },
      { name: "Q2 Target", target: 250000, current: 162500, completed: false },
      { name: "Q3 Target", target: 375000, current: 0, completed: false },
      { name: "Q4 Target", target: 500000, current: 0, completed: false }
    ]
  },
  outsideSpending: [
    { name: "Marketing", budget: 50000, spent: 28750, remaining: 21250 },
    { name: "Software Licenses", budget: 25000, spent: 22100, remaining: 2900 },
    { name: "Professional Services", budget: 75000, spent: 45300, remaining: 29700 },
    { name: "Equipment", budget: 30000, spent: 18600, remaining: 11400 }
  ],
  ytd: {
    revenue: 287500,
    expenses: 114750,
    profit: 172750
  },
  goals: [
    { name: "Increase market share by 15%", status: "in-progress", progress: 65 },
    { name: "Launch new product line", status: "completed", progress: 100 },
    { name: "Reduce operational costs by 10%", status: "in-progress", progress: 40 },
    { name: "Expand to 3 new markets", status: "pending", progress: 15 },
    { name: "Achieve 95% customer satisfaction", status: "in-progress", progress: 88 }
  ]
};

export async function GET() {
  try {
    return NextResponse.json(dashboardData);
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    dashboardData = { ...dashboardData, ...body };
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating dashboard data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
} 