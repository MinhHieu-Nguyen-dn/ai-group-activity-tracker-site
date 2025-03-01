"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Loader2, ArrowUpRight, ArrowDownLeft } from "lucide-react"
import { supabase } from "@/lib/supabase"

interface Transaction {
  id: number
  gateway: string | null
  transaction_date: string | null
  account_number: string | null
  sub_account: string | null
  amount_in: number
  amount_out: number
  accumulated: number
  code: string | null
  transaction_content: string | null
  reference_number: string | null
  body: string | null
}

// Helper function to format VND currency
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND" }).format(amount)
}

// Helper function to format date
const formatDate = (dateString: string | null) => {
  if (!dateString) return "N/A"
  return new Date(dateString).toLocaleString("vi-VN")
}

export default function TransactionHistory() {
  const [transactions, setTransactions] = useState<Transaction[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    fetchTransactions()
    const subscription = setupRealtimeSubscription()
    return () => {
      subscription.unsubscribe()
    }
  }, [])

  const fetchTransactions = async () => {
    try {
      const { data, error } = await supabase
        .from("bounty")
        .select("*")
        .order("transaction_date", { ascending: false })
        .limit(10)

      if (error) throw error

      if (data) {
        setTransactions(data as Transaction[])
      }
    } catch (error) {
      console.error("Error fetching transactions:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const setupRealtimeSubscription = () => {
    return supabase
      .channel("bounty_changes")
      .on("postgres_changes", { event: "INSERT", schema: "public", table: "bounty" }, (payload) => {
        setTransactions((prev) => [payload.new as Transaction, ...prev.slice(0, 9)])
      })
      .subscribe()
  }

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    )
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-white/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle>Recent Transactions</CardTitle>
        <CardDescription>Last 10 transactions for the bounty fund</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {transactions.length === 0 ? (
            <p className="text-center text-muted-foreground py-4">No transactions yet</p>
          ) : (
            transactions.map((transaction) => {
              const isDeposit = transaction.amount_in > 0
              const transferAmount = isDeposit ? transaction.amount_in : transaction.amount_out
              return (
                <div
                  key={transaction.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-700"
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`p-2 rounded-full ${
                        isDeposit
                          ? "bg-green-100 text-green-600 dark:bg-green-900/30 dark:text-green-400"
                          : "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400"
                      }`}
                    >
                      {isDeposit ? <ArrowDownLeft size={16} /> : <ArrowUpRight size={16} />}
                    </div>
                    <div>
                      <p className="font-medium">{transaction.transaction_content || "No description"}</p>
                      <p className="text-xs text-muted-foreground">{formatDate(transaction.transaction_date)}</p>
                    </div>
                  </div>
                  <div
                    className={`font-medium ${
                      isDeposit ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
                    }`}
                  >
                    {isDeposit ? "+" : "-"}
                    {formatVND(transferAmount)}
                  </div>
                </div>
              )
            })
          )}
        </div>
      </CardContent>
    </Card>
  )
}

