import { NextResponse } from "next/server";
import { db } from "@/config/firebase-admin";

export async function GET() {
  try {
    const snapshot = await db.collection("users").get();
    const users = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    return NextResponse.json(users);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const body = await request.json();
    const docRef = await db.collection("users").add(body);
    return NextResponse.json({ id: docRef.id, ...body });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}