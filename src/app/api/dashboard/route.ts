import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

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

// Validation schema for Dashboard payloads
const dashboardSchema = z.object({
  revenueTarget: z.number().nonnegative(),
  revenueCurrent: z.number().nonnegative(),
  milestones: z.object({
    cash: z.number().nonnegative(),
    escrow: z.number().nonnegative(),
  }),
  outsideSpending: z
    .array(
      z.object({
        label: z.string().min(1),
        amount: z.number().nonnegative(),
      })
    )
    .default([]),
  ytd: z.object({
    revenue: z.number().nonnegative(),
    expenses: z.number().nonnegative(),
  }),
  goals: z
    .array(
      z.object({
        goal: z.string().min(1),
        status: z.enum(["pending", "in-progress", "completed"]),
      })
    )
    .default([]),
});

export async function GET() {
  try {
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        const dashboard = await prisma.dashboard.findFirst();

        if (dashboard) {
          return NextResponse.json(dashboard.data);
        }
        // If no data exists, create initial data
        const newDashboard = await prisma.dashboard.create({
          data: {
            data: fallbackData,
          },
        });
        return NextResponse.json(newDashboard.data);
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
    const parseResult = dashboardSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const validData = parseResult.data;
    
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        // Update existing singleton row or create if none exists
        const existing = await prisma.dashboard.findFirst();
        const dashboard = existing
          ? await prisma.dashboard.update({
              where: { id: existing.id },
              data: { data: validData },
            })
          : await prisma.dashboard.create({
              data: { data: validData },
            });

        return NextResponse.json({
          ok: true,
          message: "Dashboard data updated successfully in database",
          data: dashboard.data,
        });
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError);
        // Fall back to in-memory
        inMemoryData = validData as typeof inMemoryData;
        return NextResponse.json({ 
          ok: true, 
          message: "Dashboard data updated successfully in memory",
          data: inMemoryData
        });
      }
    } else {
      // Update in-memory data
      inMemoryData = validData as typeof inMemoryData;
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