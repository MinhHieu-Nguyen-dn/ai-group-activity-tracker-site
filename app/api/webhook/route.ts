import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

const API_KEY = process.env.SEPAY_API_KEY;

export async function POST(request: Request) {
  // Validate API key
  // const apiKey = request.headers.get("Authorization")
  // if (apiKey !== API_KEY) {
  //   console.error("Unauthorized request attempt. Provided API key:", apiKey)
  //   return NextResponse.json({ success: false, message: "Unauthorized" }, { status: 401 })
  // }

  try {
    const data = await request.json();

    // Process the incoming data
    const {
      gateway,
      transactionDate,
      accountNumber,
      subAccount,
      transferType,
      transferAmount,
      accumulated,
      code,
      content,
      referenceCode,
      description,
    } = data;

    // Determine amount_in and amount_out
    const amount_in = transferType === "in" ? transferAmount : 0;
    const amount_out = transferType === "out" ? transferAmount : 0;

    // Build payload for the bounty table
    const payload = {
      gateway,
      transaction_date: transactionDate,
      account_number: accountNumber,
      sub_account: subAccount,
      amount_in,
      amount_out,
      accumulated,
      code,
      transaction_content: content,
      reference_number: referenceCode,
      body: description,
    };

    // Insert the new transaction record into the bounty table
    const { data: insertedRecord, error } = await supabase
      .from("bounty")
      .insert(payload);

    if (error) {
      console.error("Error inserting bounty record:", error);
      return NextResponse.json(
        {
          success: false,
          message: `Error inserting bounty record: ${error.message}`,
        },
        { status: 500 }
      );
    }

    console.log(
      "New bounty record inserted successfully:",
      payload.transaction_content
    );

    return NextResponse.json(
      {
        success: true,
        message: "New bounty record inserted successfully",
        data: payload.transaction_content,
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Unexpected error processing webhook request:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
        error: err instanceof Error ? err.message : String(err),
      },
      { status: 500 }
    );
  }
}
