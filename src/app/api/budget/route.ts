import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Fallback data if database is not available
const fallbackBudgetData = {
  fiscalYear: "FY 25-26",
  revenue: {},
  expenses: {},
  financials: {}
};

// In-memory storage for when database is not available
let inMemoryBudgetData = { ...fallbackBudgetData };

// Check if database is available
const isDatabaseAvailable = process.env.DATABASE_URL && process.env.DATABASE_URL.trim() !== "";

// Line item schema for revenue/expense items
const lineItemSchema = z.object({
  fy2324Actual: z.number().nonnegative(),
  fy2425Actual: z.number().nonnegative(),
  fy2526Budget: z.number().nonnegative(),
  fy2526Actuals: z.number().nonnegative(),
  monthlyActuals: z.array(z.number().nonnegative()).length(12)
});

// Validation schema for Budget payloads
const budgetSchema = z.object({
  fiscalYear: z.string().min(1),
  revenue: z.object({
    commissions: lineItemSchema,
    buyersPremium: lineItemSchema,
    listingFees: lineItemSchema,
    advertisingRevenue: lineItemSchema,
    variousFees: lineItemSchema,
    saasRevenue: lineItemSchema,
    otherRevenue: lineItemSchema,
  }),
  expenses: z.object({
    badDebts: lineItemSchema,
    advertisingLeadGen: lineItemSchema,
    professionalFees: lineItemSchema,
    travelMealsAuto: lineItemSchema,
    payrollBenefits: lineItemSchema,
    commissions: lineItemSchema,
    rent: lineItemSchema,
    taxesFees: lineItemSchema,
    utilities: lineItemSchema,
    bankCharges: lineItemSchema,
    officeSupplyPostage: lineItemSchema,
    rdIt: lineItemSchema,
    hrCultureAdmin: lineItemSchema,
    repairsMaintenance: lineItemSchema,
    miscellaneous: lineItemSchema,
    donations: lineItemSchema,
    professionalInsurance: lineItemSchema,
  }),
  financials: z.object({
    interestExpense: lineItemSchema,
    incomeTaxes: lineItemSchema,
  }),
});

export async function GET() {
  try {
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        const budget = await prisma.budget.findFirst();

        if (budget) {
          return NextResponse.json(budget.data);
        }
        // If no data exists, create initial data
        const newBudget = await prisma.budget.create({
          data: {
            data: fallbackBudgetData,
          },
        });
        return NextResponse.json(newBudget.data);
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError);
        return NextResponse.json(inMemoryBudgetData);
      }
    } else {
      // Use in-memory data
      return NextResponse.json(inMemoryBudgetData);
    }
  } catch (error) {
    console.error("Error fetching budget data:", error);
    return NextResponse.json(inMemoryBudgetData);
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const parseResult = budgetSchema.safeParse(body);
    if (!parseResult.success) {
      return NextResponse.json(
        { error: "Invalid budget payload", details: parseResult.error.flatten() },
        { status: 400 }
      );
    }
    const validData = parseResult.data;
    
    if (isDatabaseAvailable) {
      // Try to use database
      try {
        // Update existing singleton row or create if none exists
        const existing = await prisma.budget.findFirst();
        const budget = existing
          ? await prisma.budget.update({
              where: { id: existing.id },
              data: { data: validData },
            })
          : await prisma.budget.create({
              data: { data: validData },
            });

        return NextResponse.json({
          ok: true,
          message: "Budget data updated successfully in database",
          data: budget.data,
        });
      } catch (dbError) {
        console.log("Database error, using in-memory storage:", dbError);
        // Fall back to in-memory
        inMemoryBudgetData = validData as typeof inMemoryBudgetData;
        return NextResponse.json({ 
          ok: true, 
          message: "Budget data updated successfully in memory",
          data: inMemoryBudgetData
        });
      }
    } else {
      // Update in-memory data
      inMemoryBudgetData = validData as typeof inMemoryBudgetData;
      return NextResponse.json({ 
        ok: true, 
        message: "Budget data updated successfully in memory",
        data: inMemoryBudgetData
      });
    }
  } catch (error) {
    console.error("Error updating budget data:", error);
    return NextResponse.json({ error: "Failed to update budget data" }, { status: 500 });
  }
}
