import type { Metadata } from 'next'
import { Poppins } from 'next/font/google'
import { ThemeProvider } from '@/providers/ThemeProvider'
import { Toaster } from 'sonner'
import '@/app/globals.css'

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700', '800', '900'],
  variable: '--font-poppins',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'CookAI — AI Cooking To-Do List | PromptWars',
  description:
    'Generate your personalized daily cooking plan with AI. Get breakfast, lunch, dinner plans, grocery lists, substitutions, and budget analysis in seconds.',
  keywords: [
    'AI cooking',
    'meal planner',
    'cooking to-do list',
    'AI meal plan',
    'grocery list generator',
    'budget cooking',
    'PromptWars',
  ],
  icons: {
    icon: [
      { url: '/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon.ico' },
    ],
    apple: [{ url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' }],
    other: [
      { rel: 'android-chrome-192x192', url: '/android-chrome-192x192.png' },
      { rel: 'android-chrome-512x512', url: '/android-chrome-512x512.png' },
    ],
  },
  manifest: '/site.webmanifest',
  openGraph: {
    title: 'CookAI — AI Cooking To-Do List',
    description: 'Personalized AI meal planning. Built for PromptWars.',
    type: 'website',
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={poppins.variable}>
      <body className="min-h-screen bg-background antialiased">
        <ThemeProvider>
          {children}
          <Toaster
            theme="system"
            richColors
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'hsl(var(--surface))',
                border: '1px solid hsl(var(--border))',
                color: 'hsl(var(--foreground))',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  )
}
