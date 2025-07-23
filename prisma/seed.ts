import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

async function main() {
  await db.dashboard.upsert({
    where: { id: 1 },
    update: {},
    create: {
      data: {
        revenueTarget: 4500000,
        revenueCurrent: 1320000,
        milestones: { 
          cash: 1000000, 
          escrow: 3500000 
        },
        outsideSpending: [
          { label: "Item 1", amount: 40000 },
          { label: "Item 2", amount: 25000 },
          { label: "Item 3", amount: 25000 }
        ],
        ytd: { 
          revenue: 1000000, 
          expenses: 500000 
        },
        goals: [
          { goal: "Launch V2", status: "in-progress" },
          { goal: "Hire 2 sales reps", status: "pending" }
        ]
      }
    }
  });
  
  console.log("Database seeded successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  }); 