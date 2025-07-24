import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

export async function GET() {
  try {
    const dash = await db.dashboard.findUnique({ where: { id: 1 } });
    return NextResponse.json(dash?.data ?? {});
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ error: "Failed to fetch data" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    await db.dashboard.update({ 
      where: { id: 1 }, 
      data: { data: body } 
    });
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Error updating dashboard data:", error);
    return NextResponse.json({ error: "Failed to update data" }, { status: 500 });
  }
} 