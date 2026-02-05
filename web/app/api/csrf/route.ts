import { getCSRFToken } from "@/lib/csrf";
import { NextResponse } from "next/server";

export async function GET() {
	const token = await getCSRFToken();

	return NextResponse.json({ token });
}
