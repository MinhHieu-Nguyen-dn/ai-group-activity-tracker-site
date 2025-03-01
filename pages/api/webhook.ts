import type { NextApiRequest, NextApiResponse } from "next";
import { supabase } from "@/lib/supabase";

const API_KEY = process.env.SEPAY_API_KEY;

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  // Only allow POST requests
  if (req.method !== "POST") {
    console.error(`Invalid request method: ${req.method}. Only POST is allowed.`);
    return res.status(405).json({ success: false, message: "Method not allowed" });
  }

  // Validate API key
  const apiKey = req.headers["x-api-key"];
  if (apiKey !== API_KEY) {
    console.error("Unauthorized request attempt. Provided API key:", apiKey);
    return res.status(401).json({ success: false, message: "Unauthorized" });
  }

  try {
    const data = req.body;

    // Build payload mapping to the bounty table columns.
    // Support both snake_case and camelCase keys where appropriate.
    const payload = {
      gateway: data.gateway || null,
      transaction_date: data.transaction_date || data.transactionDate || new Date().toISOString(),
      account_number: data.account_number || data.accountNumber || null,
      sub_account: data.sub_account || data.subAccount || null,
      amount_in: data.amount_in || data.amountIn || 0.00,
      amount_out: data.amount_out || data.amountOut || 0.00,
      accumulated: data.accumulated, // expected to be provided as part of the new transaction
      code: data.code || null,
      transaction_content: data.transaction_content || data.transactionContent || null,
      reference_number: data.reference_number || data.referenceNumber || null,
      body: data.body || null,
    };

    // Insert the new transaction record into the bounty table
    const { data: insertedRecord, error } = await supabase
      .from("bounty")
      .insert(payload);

    if (error) {
      console.error("Error inserting bounty record:", error);
      return res.status(500).json({
        success: false,
        message: `Error inserting bounty record: ${error.message}`,
      });
    }

    console.log("New bounty record inserted successfully:", insertedRecord);
    return res.status(200).json({
      success: true,
      message: "New bounty record inserted successfully",
      data: insertedRecord,
    });
  } catch (err) {
    console.error("Unexpected error processing webhook request:", err);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: err instanceof Error ? err.message : err,
    });
  }
}

