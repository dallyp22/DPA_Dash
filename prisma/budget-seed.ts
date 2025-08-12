import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const initialBudgetData = {
  fiscalYear: "FY 25-26",
  revenue: {
    commissions: {
      fy2324Actual: 3700155,
      fy2425Actual: 3000748,
      fy2526Budget: 3900000,
      fy2526Actuals: 0,
      monthlyActuals: Array(12).fill(0) // Aug-Jul fiscal year
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

async function main() {
  console.log("🌱 Seeding budget data...");

  // Check if budget data already exists
  const existingBudget = await db.budget.findFirst();
  
  if (!existingBudget) {
    // Create initial budget data
    await db.budget.create({
      data: {
        data: initialBudgetData
      }
    });
    console.log("✅ Initial budget data created");
  } else {
    // Update existing budget data
    await db.budget.update({
      where: { id: existingBudget.id },
      data: {
        data: initialBudgetData
      }
    });
    console.log("✅ Existing budget data updated");
  }

  console.log("🎉 Budget seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding budget:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
