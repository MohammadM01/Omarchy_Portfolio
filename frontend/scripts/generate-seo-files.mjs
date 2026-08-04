/**
 * Regenerates public/sitemap.xml + robots.txt Sitemap line from VITE_SITE_URL.
 * Run automatically before `vite build`.
 */
import { writeFileSync } from 'node:fs'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const site = (
  process.env.VITE_SITE_URL ||
  'https://portfolio-chi-steel-82.vercel.app'
).replace(/\/$/, '')

const today = new Date().toISOString().slice(0, 10)

const urls = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/Resume.pdf', priority: '0.6', changefreq: 'monthly' },
  { path: '/og-image.svg', priority: '0.3', changefreq: 'monthly' },
  { path: '/profile.png', priority: '0.4', changefreq: 'monthly' },
  { path: '/about_pic/img.png', priority: '0.4', changefreq: 'monthly' },
]

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${site}${u.path}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.changefreq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`,
  )
  .join('\n')}
</urlset>
`

const robots = `User-agent: *
Allow: /

Disallow: /api/
Disallow: /backend/

Sitemap: ${site}/sitemap.xml
`

writeFileSync(join(root, 'public', 'sitemap.xml'), sitemap)
writeFileSync(join(root, 'public', 'robots.txt'), robots)
console.log(`[seo] sitemap + robots written for ${site}`)
