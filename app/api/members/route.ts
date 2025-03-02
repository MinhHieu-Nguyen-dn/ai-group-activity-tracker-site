import { supabase } from "@/lib/supabase";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { data, error } = await supabase
      .from("members")
      .insert([
        {
          order: body.order,
          name: body.name,
          image: body.image || null,
          postsThisMonth: 0,
          totalPosts: 0,
        },
      ])
      .select();

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, member: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const { data, error } = await supabase.from("members").select("*");

    if (error) {
      throw new Error(error.message);
    }

    return NextResponse.json({ success: true, members: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
