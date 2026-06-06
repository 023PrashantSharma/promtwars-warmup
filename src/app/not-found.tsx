import Link from 'next/link'
import { Home } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-background">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="text-8xl font-black text-gradient-green">404</div>
        <h1 className="text-2xl font-bold text-foreground">Page Not Found</h1>
        <p className="text-muted-foreground text-sm">
          Looks like this recipe doesn&apos;t exist yet.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-brand-green-500 to-brand-accent text-black font-semibold hover:opacity-90 transition-opacity btn-glow"
          id="not-found-home-btn"
        >
          <Home className="w-4 h-4" />
          Back to Kitchen
        </Link>
      </div>
    </div>
  )
}
