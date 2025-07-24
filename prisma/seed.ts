import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

const initialData = {
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

async function main() {
  console.log("🌱 Seeding database...");

  // Check if dashboard data already exists
  const existingDashboard = await db.dashboard.findFirst();
  
  if (!existingDashboard) {
    // Create initial dashboard data
    await db.dashboard.create({
      data: {
        data: initialData
      }
    });
    console.log("✅ Initial dashboard data created");
  } else {
    // Update existing dashboard data
    await db.dashboard.update({
      where: { id: existingDashboard.id },
      data: {
        data: initialData
      }
    });
    console.log("✅ Existing dashboard data updated");
  }

  console.log("🎉 Database seeding completed!");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding database:", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 