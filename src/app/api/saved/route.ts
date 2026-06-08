import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const saved = await prisma.savedCollege.findMany({
    where: { userId: session.user.id },
    include: {
      college: {
        select: {
          id: true, name: true, slug: true, location: true, city: true,
          state: true, imageUrl: true, totalFee: true, rating: true,
          type: true, placementPercent: true, avgPackage: true,
          highestPackage: true, establishedYear: true,
        },
      },
    },
    orderBy: { savedAt: "desc" },
  });

  return NextResponse.json(saved.map((s) => s.college));
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { collegeId } = await req.json();
  if (!collegeId) {
    return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  }

  try {
    await prisma.savedCollege.create({
      data: { userId: session.user.id, collegeId },
    });
    return NextResponse.json({ saved: true }, { status: 201 });
  } catch {
    return NextResponse.json({ error: "Already saved" }, { status: 409 });
  }
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const { collegeId } = await req.json();
  if (!collegeId) {
    return NextResponse.json({ error: "collegeId required" }, { status: 400 });
  }

  await prisma.savedCollege.deleteMany({
    where: { userId: session.user.id, collegeId },
  });

  return NextResponse.json({ saved: false });
}
