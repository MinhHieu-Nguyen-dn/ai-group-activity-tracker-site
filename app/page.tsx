import { Suspense } from "react"
import dynamic from "next/dynamic"
import { Toaster } from "@/components/ui/toaster"
import Navbar from "@/components/navbar"
import { Card } from "@/components/ui/card"
import { Loader2 } from "lucide-react"

const MonthlyBounty = dynamic(() => import("@/components/shared-fund"), {
  loading: () => <LoadingCard height="300px" />,
})

const MemberRanking = dynamic(() => import("@/components/member-ranking"), {
  loading: () => <LoadingCard height="500px" />,
})

const TransactionHistory = dynamic(() => import("@/components/transaction-history"), {
  loading: () => <LoadingCard height="300px" />,
})

function LoadingCard({ height }: { height: string }) {
  return (
    <Card className={`h-[${height}] flex items-center justify-center`}>
      <Loader2 className="h-8 w-8 animate-spin" />
    </Card>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 dark:from-indigo-950 dark:via-purple-950 dark:to-pink-950 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-200 dark:bg-purple-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-indigo-200 dark:bg-indigo-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-pink-200 dark:bg-pink-900 rounded-full mix-blend-multiply dark:mix-blend-soft-light filter blur-3xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      <Navbar />

      <main className="pt-24 p-6 relative z-10">
        <div className="max-w-7xl mx-auto space-y-8">
          <header className="text-center">
            <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-slate-50">
              Sharing is learning!
            </h1>
            <p className="text-slate-500 dark:text-slate-400 mt-2">Contribute and claim the monthly shared-bounty!</p>
          </header>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="md:col-span-1">
              <Suspense fallback={<LoadingCard height="300px" />}>
                <MonthlyBounty />
              </Suspense>
            </div>

            <div className="md:col-span-2">
              <Suspense fallback={<LoadingCard height="500px" />}>
                <MemberRanking />
              </Suspense>
            </div>
          </div>

          <div className="grid grid-cols-1">
            <Suspense fallback={<LoadingCard height="300px" />}>
              <TransactionHistory />
            </Suspense>
          </div>
        </div>
      </main>
      <Toaster />
    </div>
  )
}

