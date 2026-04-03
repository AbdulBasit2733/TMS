"use client"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { Loader2 } from "lucide-react"
import { Navbar } from "@/components/layout/Navbar"
import Loading from "@/components/common/Loading"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { isAuthenticated, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) router.replace("/login")
  }, [isAuthenticated, isLoading, router])

  if (isLoading) {
    return (
      <Loading />
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="container mx-auto max-w-7xl flex-1 px-4 py-8">
        {children}
      </main>
    </div>
  )
}
