'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function HomePage() {
  const router = useRouter()

  useEffect(() => {
    // 重定向到默认的 GRCh37 页面
    router.replace('/grch37')
  }, [router])

  return (
    <main className="container mx-auto p-4 h-screen flex flex-col items-center justify-center">
      <div className="text-lg">Redirecting to GRCh37...</div>
    </main>
  )
}
