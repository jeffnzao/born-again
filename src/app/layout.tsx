import type { Metadata } from 'next'
import { Providers } from './providers'
import './globals.css'

export const metadata: Metadata = {
  title: 'Nouvelle Création - Plateforme Spirituelle',
  description: 'Votre compagnon spirituel pour la victoire, la pureté et la restauration en Christ',
  keywords: ['spirituel', 'victoire', 'prière', 'bible', 'transformation'],
  authors: [{ name: 'Nouvelle Création' }],
  viewport: 'width=device-width, initial-scale=1',
  themeColor: '#2d0d4d',
  manifest: '/manifest.json',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/favicon.ico" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
      </head>
      <body className="bg-spiritual-950 text-spiritual-200">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
