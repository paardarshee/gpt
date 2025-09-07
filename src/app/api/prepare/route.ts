import { NextResponse } from "next/server";
import mongoose from "mongoose";

export async function GET() {
	const ObjectId = mongoose.Types.ObjectId;
	return NextResponse.json({ messageId: new ObjectId().toString() });
}
