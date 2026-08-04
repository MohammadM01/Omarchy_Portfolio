import { useEffect } from 'react'
import PropTypes from 'prop-types'
import { buildAllSchemas } from '../../seo/buildSchemas'
import {
  absoluteUrl,
  CONTENT_LANGUAGE,
  DEFAULT_DESCRIPTION,
  DEFAULT_LOCALE,
  DEFAULT_TITLE,
  GEO,
  KEYWORDS,
  SITE_NAME,
  SITE_URL,
  SOCIAL_IMAGE_ALT,
  SOCIAL_IMAGE_PATH,
} from '../../seo/siteConfig'

function upsertMeta(attr, key, content) {
  if (content == null || content === '') return
  let el = document.head.querySelector(`meta[${attr}="${key}"]`)
  if (!el) {
    el = document.createElement('meta')
    el.setAttribute(attr, key)
    document.head.appendChild(el)
  }
  el.setAttribute('content', content)
}

function upsertLink(rel, href, extra = {}) {
  if (!href) return
  const hreflang = extra.hreflang
  const selector = hreflang
    ? `link[rel="${rel}"][hreflang="${hreflang}"]`
    : `link[rel="${rel}"]:not([hreflang])`
  let el = document.head.querySelector(selector)
  if (!el) {
    el = document.createElement('link')
    el.setAttribute('rel', rel)
    document.head.appendChild(el)
  }
  el.setAttribute('href', href)
  Object.entries(extra).forEach(([k, v]) => el.setAttribute(k, v))
}

function upsertJsonLd(id, data) {
  let el = document.getElementById(id)
  if (!el) {
    el = document.createElement('script')
    el.type = 'application/ld+json'
    el.id = id
    document.head.appendChild(el)
  }
  el.textContent = JSON.stringify(data)
}

/**
 * Applies document-level SEO (meta, OG, Twitter, geo, JSON-LD).
 * Safe for SPA — runs after mount and when props change.
 */
export function SeoHead({
  title = DEFAULT_TITLE,
  description = DEFAULT_DESCRIPTION,
  path = '/',
  image = SOCIAL_IMAGE_PATH,
  type = 'website',
  noIndex = false,
}) {
  useEffect(() => {
    const url = absoluteUrl(path)
    const imageUrl = absoluteUrl(image)

    document.title = title
    document.documentElement.lang = 'en'
    document.documentElement.setAttribute('data-locale', DEFAULT_LOCALE)

    upsertMeta('name', 'description', description)
    upsertMeta('name', 'keywords', KEYWORDS)
    upsertMeta('name', 'author', 'Mohammad Mulla')
    upsertMeta(
      'name',
      'robots',
      noIndex
        ? 'noindex, nofollow'
        : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
    )
    upsertMeta('name', 'googlebot', noIndex ? 'noindex' : 'index, follow')
    upsertMeta('name', 'language', CONTENT_LANGUAGE)
    upsertMeta('http-equiv', 'content-language', 'en-IN')
    upsertMeta('name', 'theme-color', '#0078D4')
    upsertMeta('name', 'application-name', SITE_NAME)
    upsertMeta('name', 'apple-mobile-web-app-title', SITE_NAME)
    upsertMeta('name', 'format-detection', 'telephone=yes')

    // GEO
    upsertMeta('name', 'geo.region', GEO.region)
    upsertMeta('name', 'geo.placename', GEO.placename)
    upsertMeta('name', 'geo.position', `${GEO.latitude};${GEO.longitude}`)
    upsertMeta('name', 'ICBM', `${GEO.latitude}, ${GEO.longitude}`)

    // Open Graph
    upsertMeta('property', 'og:type', type)
    upsertMeta('property', 'og:site_name', SITE_NAME)
    upsertMeta('property', 'og:title', title)
    upsertMeta('property', 'og:description', description)
    upsertMeta('property', 'og:url', url)
    upsertMeta('property', 'og:image', imageUrl)
    upsertMeta('property', 'og:image:alt', SOCIAL_IMAGE_ALT)
    upsertMeta('property', 'og:locale', DEFAULT_LOCALE)
    upsertMeta('property', 'og:locale:alternate', 'en_US')

    // Twitter / X
    upsertMeta('name', 'twitter:card', 'summary_large_image')
    upsertMeta('name', 'twitter:title', title)
    upsertMeta('name', 'twitter:description', description)
    upsertMeta('name', 'twitter:image', imageUrl)
    upsertMeta('name', 'twitter:image:alt', SOCIAL_IMAGE_ALT)

    upsertLink('canonical', url)
    upsertLink('alternate', url, { hreflang: 'en-IN' })
    upsertLink('alternate', url, { hreflang: 'x-default' })
    upsertLink('manifest', '/manifest.webmanifest')

    const schemas = buildAllSchemas()
    schemas.forEach((schema, i) => {
      upsertJsonLd(`seo-jsonld-${i}`, schema)
    })
  }, [title, description, path, image, type, noIndex])

  return null
}

SeoHead.propTypes = {
  title: PropTypes.string,
  description: PropTypes.string,
  path: PropTypes.string,
  image: PropTypes.string,
  type: PropTypes.string,
  noIndex: PropTypes.bool,
}

export { SITE_URL, SITE_NAME }
