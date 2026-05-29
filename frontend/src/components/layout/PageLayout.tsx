import type { ReactNode } from 'react'
import { Header } from './Header'
import { Footer } from './Footer'

export function PageLayout({ children }: { children: ReactNode }) {
  return (
    <div className="site-wrapper">
      <Header />
      <main className="site-main">{children}</main>
      <Footer />
    </div>
  )
}
