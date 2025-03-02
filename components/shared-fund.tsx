"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Trophy, DollarSign, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

// Helper function to format VND currency
const formatVND = (amount: number) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

export default function MonthlyBounty() {
  const [bountyAmount, setBountyAmount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchBountyAmount();
    const subscription = setupRealtimeSubscription();
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  const fetchBountyAmount = async () => {
    try {
      const { data, error } = await supabase
        .from("bounty")
        .select("accumulated")
        .order("id", { ascending: false })
        .limit(1);

      if (error) throw error;

      if (data && data.length > 0) {
        setBountyAmount(data[0].accumulated);
      } else {
        setBountyAmount(0);
        console.log("No bounty records found");
      }
    } catch (error) {
      console.error("Error fetching bounty amount:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const setupRealtimeSubscription = () => {
    return supabase
      .channel("bounty_changes")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "bounty" },
        (payload) => {
          console.log("Realtime insert payload:", payload);
          setBountyAmount(payload.new.accumulated);

          const isDeposit = payload.new.amount_in > 0;
          const amount = isDeposit
            ? payload.new.amount_in
            : payload.new.amount_out;

          toast(isDeposit ? "New Deposit" : "New Withdrawal", {
            description: (
              <div className="flex flex-col gap-1">
                <div className="flex justify-between">
                  <span>Amount:</span>
                  <span
                    className={isDeposit ? "text-green-600" : "text-red-600"}
                  >
                    {formatVND(amount)}
                  </span>
                </div>
                {payload.new.transaction_content && (
                  <div className="flex justify-between">
                    <span>Content:</span>
                    <span className="font-medium">
                      {payload.new.transaction_content}
                    </span>
                  </div>
                )}
              </div>
            ),
            duration: 5000,
          });
        }
      )
      .subscribe();
  };

  if (isLoading) {
    return (
      <Card className="h-full flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </Card>
    );
  }

  return (
    <Card className="h-full transition-all duration-300 hover:shadow-md backdrop-blur-sm bg-white/70 dark:bg-slate-900/70 border-white/50 dark:border-slate-700/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center">
            <Trophy className="mr-2 text-yellow-500" />
            Monthly Bounty
          </span>
          <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400">
            {formatVND(bountyAmount)}
          </span>
        </CardTitle>
        <CardDescription>
          Bounty pool for this month's top contributor
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center">
        <div className="relative w-48 h-48 mb-4">
          <div className="absolute inset-0 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-lg p-2 shadow-md">
            <div className="absolute inset-0 flex items-center justify-center">
              <DollarSign className="text-white w-24 h-24 opacity-20" />
            </div>
            <Image
              src="https://qr.sepay.vn/img?acc=10001009980&bank=TPBank"
              alt="Donation QR Code"
              width={200}
              height={200}
              className="rounded-md relative z-10"
            />
          </div>
        </div>
        <p className="text-sm text-slate-500 dark:text-slate-400 text-center">
          Scan to contribute
        </p>
      </CardContent>
    </Card>
  );
}
