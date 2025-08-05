import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Alvara NFT Platform - Mint Your Digital Assets',
  description: 'Create, mint, and trade NFTs on the Alvara platform. Build your digital legacy with our innovative NFT minting platform.',
  keywords: 'NFT, minting, blockchain, ethereum, alvara, digital assets',
  authors: [{ name: 'Alvara Foundation' }],
  openGraph: {
    title: 'Alvara NFT Platform',
    description: 'Create, mint, and trade NFTs on the Alvara platform',
    type: 'website',
    locale: 'en_US',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link rel="icon" type="image/png" href="/images/alvara2.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=JetBrains+Mono:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </head>
      <body className={`${inter.className} bg-[#1D132E] text-eggshell-50 antialiased`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
} 