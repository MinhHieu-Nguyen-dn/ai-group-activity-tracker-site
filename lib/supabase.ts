import { createClient } from "@supabase/supabase-js"
import type { Database } from "./database.types"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

console.log("Supabase URL:", supabaseUrl ? "exists" : "missing")
console.log("Supabase Anon Key:", supabaseAnonKey ? "exists" : "missing")

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables")
}

// Validate URL format
try {
  new URL(supabaseUrl)
} catch (e) {
  throw new Error(`Invalid Supabase URL: ${supabaseUrl}`)
}

export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey)

// Test the connection
supabase
  .from("bounty")
  .select("*")
  .limit(1)
  .then(({ data, error }) => {
    if (error) {
      console.error("Supabase connection error:", error)
    } else {
      console.log("Supabase connection successful, first bounty record:", data[0])
    }
  })
  .catch((error) => console.error("Supabase connection error:", error))

