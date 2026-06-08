import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { reviewSchema } from "@/lib/validations";

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorised" }, { status: 401 });
  }

  const body = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid input", details: parsed.error.flatten() },
      { status: 400 }
    );
  }

  const { collegeId, rating, comment } = parsed.data;

  // Check college exists
  const college = await prisma.college.findUnique({ where: { id: collegeId }, select: { id: true } });
  if (!college) {
    return NextResponse.json({ error: "College not found" }, { status: 404 });
  }

  try {
    const review = await prisma.review.create({
      data: { collegeId, rating, comment, userId: session.user.id },
      include: { user: { select: { id: true, name: true, image: true } } },
    });
    return NextResponse.json(review, { status: 201 });
  } catch {
    // Unique constraint = already reviewed
    return NextResponse.json(
      { error: "You have already reviewed this college" },
      { status: 409 }
    );
  }
}
