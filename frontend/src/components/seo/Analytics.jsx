import { useEffect } from 'react'
import PropTypes from 'prop-types'

/**
 * Optional GA4 — only loads when VITE_GA_ID is set.
 */
export function Analytics({ measurementId = import.meta.env.VITE_GA_ID }) {
  useEffect(() => {
    if (!measurementId || typeof window === 'undefined') return

    const existing = document.getElementById('ga4-gtag')
    if (existing) return

    const script = document.createElement('script')
    script.id = 'ga4-gtag'
    script.async = true
    script.src = `https://www.googletagmanager.com/gtag/js?id=${measurementId}`
    document.head.appendChild(script)

    window.dataLayer = window.dataLayer || []
    function gtag() {
      window.dataLayer.push(arguments)
    }
    window.gtag = gtag
    gtag('js', new Date())
    gtag('config', measurementId, { anonymize_ip: true })
  }, [measurementId])

  return null
}

Analytics.propTypes = {
  measurementId: PropTypes.string,
}
