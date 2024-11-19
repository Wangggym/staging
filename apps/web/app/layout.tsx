import './globals.css'

export const metadata = {
  title: 'Full-stack App',
  description: 'Next.js + Fastify + PostgreSQL',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}