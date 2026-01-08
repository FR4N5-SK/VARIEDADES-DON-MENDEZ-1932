"use client"

import { useAuth } from "@/lib/auth"
import { LoginForm } from "@/components/login-form"
import { Dashboard } from "@/components/dashboard"

export default function HomePage() {
  const isAuthenticated = useAuth((state) => state.isAuthenticated)

  if (!isAuthenticated) {
    return <LoginForm />
  }

  return <Dashboard />
}
