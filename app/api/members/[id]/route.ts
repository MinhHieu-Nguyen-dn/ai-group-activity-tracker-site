import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await req.json();

    const { data, error } = await supabase
      .from("members")
      .update(body)
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, member: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    const { error } = await supabase.from("members").delete().eq("id", id);
    if (error) throw new Error(error.message);

    return NextResponse.json({
      success: true,
      message: "Member deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const { increment } = await req.json(); // `increment: true` -> Increase, `false` -> Decrease

    // First, fetch current values
    const { data: member, error: fetchError } = await supabase
      .from("members")
      .select("postsThisMonth, totalPosts")
      .eq("id", id)
      .single();

    if (fetchError || !member)
      throw new Error(fetchError?.message || "Member not found");

    // Calculate new values
    const newPostsThisMonth = increment
      ? member.postsThisMonth + 1
      : Math.max(0, member.postsThisMonth - 1);
    const newTotalPosts = increment
      ? member.totalPosts + 1
      : Math.max(0, member.totalPosts - 1);

    // Update the values
    const { data, error } = await supabase
      .from("members")
      .update({ postsThisMonth: newPostsThisMonth, totalPosts: newTotalPosts })
      .eq("id", id)
      .select()
      .single();

    if (error) throw new Error(error.message);

    return NextResponse.json({ success: true, member: data });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
