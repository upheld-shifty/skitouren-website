import { useEffect } from 'react'

const SITE = 'Tourenberichte'
const DEFAULT_DESC = 'Schweizer Tourenberichte — Wanderungen, Skitouren, Klettersteige und Hochtouren'

export function usePageMeta(title?: string, description?: string) {
  useEffect(() => {
    const prev = document.title
    document.title = title ? `${title} – ${SITE}` : SITE

    const metaDesc = document.querySelector<HTMLMetaElement>('meta[name="description"]')
    const prevDesc = metaDesc?.getAttribute('content') ?? ''
    if (metaDesc) metaDesc.setAttribute('content', description ?? DEFAULT_DESC)

    return () => {
      document.title = prev
      if (metaDesc) metaDesc.setAttribute('content', prevDesc)
    }
  }, [title, description])
}
