import { NextRequest, NextResponse } from "next/server";

// Fallback data if database is not available
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

// In-memory storage for when database is not available
let inMemoryData = { ...fallbackData };

// Try to initialize Prisma, but fall back gracefully if it fails
let prisma: any = null;
try {
  if (process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "") {
    const { PrismaClient } = require("@prisma/client");
    prisma = new PrismaClient();
  }
} catch (error) {
  console.log("Database not available, using in-memory storage");
}

export async function GET() {
  try {
    if (prisma) {
      // Try to get data from database
      const dashboard = await prisma.dashboard.findFirst();
      
      if (dashboard) {
        return NextResponse.json(dashboard.data);
      } else {
        // If no data exists, create initial data
        const newDashboard = await prisma.dashboard.create({
          data: {
            data: fallbackData
          }
        });
        return NextResponse.json(newDashboard.data);
      }
    } else {
      // Use in-memory data
      return NextResponse.json(inMemoryData);
    }
  } catch (error) {
    console.error("Database error, using in-memory data:", error);
    return NextResponse.json(inMemoryData);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (prisma) {
      // Update or create dashboard data in database
      const dashboard = await prisma.dashboard.upsert({
        where: { id: 1 },
        update: {
          data: body
        },
        create: {
          data: body
        }
      });
      
      return NextResponse.json({ 
        ok: true, 
        message: "Dashboard data updated successfully in database",
        data: dashboard.data
      });
    } else {
      // Update in-memory data
      inMemoryData = body;
      return NextResponse.json({ 
        ok: true, 
        message: "Dashboard data updated successfully in memory",
        data: inMemoryData
      });
    }
  } catch (error) {
    console.error("Error updating dashboard data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
} 