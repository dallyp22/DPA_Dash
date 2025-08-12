import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { z } from "zod";

// Fallback data if database is not available - matches the seed data structure
const fallbackBudgetData = {
  fiscalYear: "FY 25-26",
  revenue: {
    commissions: {
      fy2324Actual: 3700155,
      fy2425Actual: 3000748,
      fy2526Budget: 3900000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    buyersPremium: {
      fy2324Actual: 5634392,
      fy2425Actual: 4363688,
      fy2526Budget: 5590000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    listingFees: {
      fy2324Actual: 416402,
      fy2425Actual: 371290,
      fy2526Budget: 432000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    advertisingRevenue: {
      fy2324Actual: 221350,
      fy2425Actual: 233355,
      fy2526Budget: 310000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    variousFees: {
      fy2324Actual: 129672,
      fy2425Actual: 108842,
      fy2526Budget: 135000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    saasRevenue: {
      fy2324Actual: 0,
      fy2425Actual: 0,
      fy2526Budget: 30000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    otherRevenue: {
      fy2324Actual: 231031,
      fy2425Actual: 81355,
      fy2526Budget: 100000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    }
  },
  expenses: {
    badDebts: {
      fy2324Actual: 102969,
      fy2425Actual: 58157,
      fy2526Budget: 74820,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    advertisingLeadGen: {
      fy2324Actual: 875365,
      fy2425Actual: 951243,
      fy2526Budget: 950000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    professionalFees: {
      fy2324Actual: 157998,
      fy2425Actual: 107876,
      fy2526Budget: 115000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    travelMealsAuto: {
      fy2324Actual: 608094,
      fy2425Actual: 491549,
      fy2526Budget: 410000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    payrollBenefits: {
      fy2324Actual: 5003857,
      fy2425Actual: 5121491,
      fy2526Budget: 4971838,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    commissions: {
      fy2324Actual: 229098,
      fy2425Actual: 244778,
      fy2526Budget: 314910,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    rent: {
      fy2324Actual: 276000,
      fy2425Actual: 373000,
      fy2526Budget: 276000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    taxesFees: {
      fy2324Actual: 64098,
      fy2425Actual: 48628,
      fy2526Budget: 70000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    utilities: {
      fy2324Actual: 109113,
      fy2425Actual: 105442,
      fy2526Budget: 120000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    bankCharges: {
      fy2324Actual: 73878,
      fy2425Actual: 75800,
      fy2526Budget: 88000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    officeSupplyPostage: {
      fy2324Actual: 474727,
      fy2425Actual: 178870,
      fy2526Budget: 200000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    rdIt: {
      fy2324Actual: 36182,
      fy2425Actual: 328621,
      fy2526Budget: 300000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    hrCultureAdmin: {
      fy2324Actual: 286141,
      fy2425Actual: 89035,
      fy2526Budget: 95000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    repairsMaintenance: {
      fy2324Actual: 57486,
      fy2425Actual: 112541,
      fy2526Budget: 65000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    miscellaneous: {
      fy2324Actual: 0,
      fy2425Actual: 43563,
      fy2526Budget: 50000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    donations: {
      fy2324Actual: 18110,
      fy2425Actual: 35678,
      fy2526Budget: 25000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    professionalInsurance: {
      fy2324Actual: 46581,
      fy2425Actual: 39106,
      fy2526Budget: 50000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    }
  },
  financials: {
    interestExpense: {
      fy2324Actual: 0,
      fy2425Actual: 0,
      fy2526Budget: 240000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    },
    incomeTaxes: {
      fy2324Actual: 401794,
      fy2425Actual: 0,
      fy2526Budget: 437101,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0)
    }
  }
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
