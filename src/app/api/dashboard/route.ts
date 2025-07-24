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

// Check if database is available
const isDatabaseAvailable = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "";

export async function GET() {
  try {
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        
        const dashboard = await prisma.dashboard.findFirst();
        
        if (dashboard) {
          await prisma.$disconnect();
          return NextResponse.json(dashboard.data);
        } else {
          // If no data exists, create initial data
          const newDashboard = await prisma.dashboard.create({
            data: {
              data: fallbackData
            }
          });
          await prisma.$disconnect();
          return NextResponse.json(newDashboard.data);
        }
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError);
        return NextResponse.json(inMemoryData);
      }
    } else {
      // Use in-memory data
      return NextResponse.json(inMemoryData);
    }
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json(inMemoryData);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        const { PrismaClient } = await import("@prisma/client");
        const prisma = new PrismaClient();
        
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
        
        await prisma.$disconnect();
        
        return NextResponse.json({ 
          ok: true, 
          message: "Dashboard data updated successfully in database",
          data: dashboard.data
        });
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError);
        // Fall back to in-memory
        inMemoryData = body;
        return NextResponse.json({ 
          ok: true, 
          message: "Dashboard data updated successfully in memory",
          data: inMemoryData
        });
      }
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