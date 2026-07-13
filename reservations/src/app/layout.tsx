import './globals.css'
import { Header } from '../components/Header'
import { Sidebar } from '../components/Sidebar'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pt-br">
      <body className="flex bg-[#313338] text-[#f2f3f5] min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col">
          <Header />
          <main>{children}</main>
        </div>
      </body>
    </html>
  )
}