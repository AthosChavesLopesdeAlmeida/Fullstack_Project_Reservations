import './globals.css'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br" className="h-full">
      <body className="bg-[#313338] text-[#f2f3f5] min-h-full font-sans antialiased">
        {children}
      </body>
    </html>
  )
}