import { NextResponse } from "next/server";
import { getZineContent } from "@/lib/zine-data";

export async function GET() {
  return NextResponse.json(await getZineContent());
}