/**
 * Detailed SEO audit for Mohammad's Portfolio.
 * Usage: node scripts/seo-audit.mjs
 */
import { readFileSync, existsSync, statSync } from 'node:fs'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = join(__dirname, '..')
const dist = join(root, 'dist')
const pub = join(root, 'public')

const SITE = 'https://portfolio-chi-steel-82.vercel.app'
const results = { pass: [], fail: [], warn: [], info: [] }

function pass(msg) {
  results.pass.push(msg)
}
function fail(msg) {
  results.fail.push(msg)
}
function warn(msg) {
  results.warn.push(msg)
}
function info(msg) {
  results.info.push(msg)
}

function getAttr(html, tag, attr, name) {
  const re = new RegExp(
    `<${tag}[^>]*${attr}=["']${name}["'][^>]*content=["']([^"']*)["']|<${tag}[^>]*content=["']([^"']*)["'][^>]*${attr}=["']${name}["']`,
    'i',
  )
  const m = html.match(re)
  return m ? m[1] || m[2] : null
}

function getLinkHref(html, rel, hreflang) {
  const re = hreflang
    ? new RegExp(
        `<link[^>]*rel=["']${rel}["'][^>]*hreflang=["']${hreflang}["'][^>]*href=["']([^"']+)["']|<link[^>]*hreflang=["']${hreflang}["'][^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`,
        'i',
      )
    : new RegExp(`<link[^>]*rel=["']${rel}["'][^>]*href=["']([^"']+)["']`, 'i')
  const m = html.match(re)
  return m ? m[1] || m[2] : null
}

function extractJsonLd(html) {
  const blocks = []
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi
  let m
  while ((m = re.exec(html))) {
    try {
      blocks.push(JSON.parse(m[1].trim()))
    } catch (e) {
      fail(`JSON-LD parse error: ${e.message}`)
    }
  }
  return blocks
}

function validatePerson(schema) {
  const need = ['name', 'jobTitle', 'url', 'sameAs', 'address']
  for (const k of need) {
    if (!schema[k]) fail(`Person schema missing ${k}`)
    else pass(`Person.@type has ${k}`)
  }
  if (schema.name !== 'Mohammad Mulla') fail(`Person.name unexpected: ${schema.name}`)
  else pass('Person.name = Mohammad Mulla')
  if (!Array.isArray(schema.sameAs) || schema.sameAs.length < 2)
    fail('Person.sameAs should include LinkedIn + GitHub')
  else pass(`Person.sameAs count=${schema.sameAs.length}`)
}

function validateFaq(schema) {
  if (schema['@type'] !== 'FAQPage') return
  const q = schema.mainEntity || []
  if (q.length < 5) warn(`FAQPage only has ${q.length} questions (want ≥5)`)
  else pass(`FAQPage has ${q.length} Q&As`)
  for (const item of q) {
    if (!item.name || !item.acceptedAnswer?.text)
      fail(`FAQ item incomplete: ${item.name || '(no name)'}`)
  }
}

console.log('\n========== SEO AUDIT ==========\n')

// ——— 1. Build artifacts ———
info('1) Dist / public artifacts')
const indexPath = existsSync(join(dist, 'index.html'))
  ? join(dist, 'index.html')
  : join(root, 'index.html')
if (!existsSync(indexPath)) fail('index.html missing')
else pass(`index.html found (${statSync(indexPath).size} bytes)`)

for (const f of ['robots.txt', 'sitemap.xml', 'manifest.webmanifest', 'og-image.svg', 'profile.png', 'Resume.pdf']) {
  const p = existsSync(join(dist, f)) ? join(dist, f) : join(pub, f)
  if (existsSync(p)) pass(`Asset present: ${f}`)
  else fail(`Missing asset: ${f}`)
}

const html = readFileSync(indexPath, 'utf8')

// ——— 2. Primary meta ———
info('2) Title & meta description')
const titleMatch = html.match(/<title>([^<]*)<\/title>/i)
const title = titleMatch?.[1]?.trim()
if (!title) fail('Missing <title>')
else if (title.length < 30 || title.length > 70)
  warn(`Title length ${title.length} (ideal 30–60): "${title}"`)
else pass(`Title OK (${title.length} chars): ${title}`)

const desc = getAttr(html, 'meta', 'name', 'description')
if (!desc) fail('Missing meta description')
else if (desc.length < 70 || desc.length > 170)
  warn(`Description length ${desc.length} (ideal ~120–160)`)
else pass(`Description OK (${desc.length} chars)`)

if (desc && /Windows\s*12/i.test(desc)) fail('Description still mentions Windows 12')
else if (desc) pass('Description has no Windows 12 branding')

const robots = getAttr(html, 'meta', 'name', 'robots')
if (!robots || !/index/i.test(robots)) fail('robots meta missing index')
else pass(`robots: ${robots}`)

const keywords = getAttr(html, 'meta', 'name', 'keywords')
if (!keywords) warn('No keywords meta (optional)')
else if (!/Mohammad Mulla/i.test(keywords)) fail('Keywords missing primary name')
else pass('Keywords include Mohammad Mulla')

// ——— 3. Canonical / hreflang ———
info('3) Canonical & hreflang')
const canonical = getLinkHref(html, 'canonical')
if (!canonical) fail('Missing canonical')
else if (!canonical.startsWith('https://')) fail(`Canonical not HTTPS: ${canonical}`)
else pass(`Canonical: ${canonical}`)

const hreflangEn = getLinkHref(html, 'alternate', 'en-IN')
const hreflangDefault = getLinkHref(html, 'alternate', 'x-default')
if (!hreflangEn) warn('Missing hreflang en-IN')
else pass(`hreflang en-IN → ${hreflangEn}`)
if (!hreflangDefault) warn('Missing hreflang x-default')
else pass(`hreflang x-default → ${hreflangDefault}`)

// Fake language pages should NOT exist
if (/hreflang=["']hi/i.test(html)) warn('Hindi hreflang present without a /hi page')
else pass('No fake hi/mr hreflang pages')

// ——— 4. Open Graph ———
info('4) Open Graph')
const ogRequired = {
  'og:title': getAttr(html, 'meta', 'property', 'og:title'),
  'og:description': getAttr(html, 'meta', 'property', 'og:description'),
  'og:image': getAttr(html, 'meta', 'property', 'og:image'),
  'og:url': getAttr(html, 'meta', 'property', 'og:url'),
  'og:type': getAttr(html, 'meta', 'property', 'og:type'),
  'og:locale': getAttr(html, 'meta', 'property', 'og:locale'),
}
for (const [k, v] of Object.entries(ogRequired)) {
  if (!v) fail(`Missing ${k}`)
  else pass(`${k} = ${v.slice(0, 80)}${v.length > 80 ? '…' : ''}`)
}
if (ogRequired['og:image'] && !ogRequired['og:image'].startsWith('http'))
  warn('og:image should be absolute URL for social crawlers')
if (ogRequired['og:image']?.endsWith('.svg'))
  warn('og:image is SVG — LinkedIn/Twitter often prefer PNG/JPG 1200×630')

// ——— 5. Twitter ———
info('5) Twitter cards')
for (const k of ['twitter:card', 'twitter:title', 'twitter:description', 'twitter:image']) {
  const v = getAttr(html, 'meta', 'name', k)
  if (!v) fail(`Missing ${k}`)
  else pass(`${k} present`)
}

// ——— 6. GEO ———
info('6) GEO tags')
const geoRegion = getAttr(html, 'meta', 'name', 'geo.region')
const geoPos = getAttr(html, 'meta', 'name', 'geo.position')
const icbm = getAttr(html, 'meta', 'name', 'ICBM')
if (geoRegion !== 'IN-MH') fail(`geo.region expected IN-MH got ${geoRegion}`)
else pass('geo.region = IN-MH')
if (!geoPos || !icbm) fail('Missing geo.position / ICBM')
else pass(`geo.position=${geoPos} ICBM=${icbm}`)

// ——— 7. JSON-LD ———
info('7) JSON-LD structured data')
const schemas = extractJsonLd(html)
if (!schemas.length) fail('No JSON-LD in static HTML')
else pass(`${schemas.length} JSON-LD block(s) in HTML`)

const types = new Set()
function walkType(obj) {
  if (!obj || typeof obj !== 'object') return
  if (obj['@type']) types.add(obj['@type'])
  if (Array.isArray(obj)) obj.forEach(walkType)
  else Object.values(obj).forEach(walkType)
}
schemas.forEach(walkType)

const person = schemas.find((s) => s['@type'] === 'Person')
if (!person) fail('Static HTML missing Person schema')
else validatePerson(person)

info(`Schema @types found in HTML: ${[...types].join(', ') || '(none)'}`)

// Runtime schemas (from source module expectations)
const expectedRuntime = [
  'Person',
  'WebSite',
  'ProfilePage',
  'CollectionPage',
  'FAQPage',
  'Place',
  'EducationalOccupationalCredential',
]
info(`Runtime SeoHead should inject: ${expectedRuntime.join(', ')}`)

// ——— 8. noscript / semantic ———
info('8) Noscript & semantics')
if (!/<noscript>/i.test(html)) fail('Missing <noscript> fallback')
else pass('noscript fallback present')
if (!/Mohammad Mulla/i.test(html.match(/<noscript>[\s\S]*?<\/noscript>/i)?.[0] || ''))
  fail('noscript missing name')
else pass('noscript includes Mohammad Mulla')
if (!/<html[^>]*lang=["']en/i.test(html)) fail('html lang not en')
else pass('html lang=en')

// ——— 9. robots.txt ———
info('9) robots.txt')
const robotsTxt = readFileSync(
  existsSync(join(dist, 'robots.txt')) ? join(dist, 'robots.txt') : join(pub, 'robots.txt'),
  'utf8',
)
if (!/User-agent:\s*\*/i.test(robotsTxt)) fail('robots.txt missing User-agent: *')
else pass('robots.txt User-agent: *')
if (!/Allow:\s*\//i.test(robotsTxt)) fail('robots.txt missing Allow: /')
else pass('robots.txt Allow: /')
if (!/Sitemap:\s*https:\/\//i.test(robotsTxt)) fail('robots.txt Sitemap must be absolute HTTPS')
else pass(`robots.txt Sitemap line OK`)
if (/Disallow:\s*\/\s*$/m.test(robotsTxt)) fail('robots.txt Disallow: / would block site')
else pass('robots.txt does not blanket-disallow /')

// ——— 10. sitemap.xml ———
info('10) sitemap.xml')
const sitemap = readFileSync(
  existsSync(join(dist, 'sitemap.xml')) ? join(dist, 'sitemap.xml') : join(pub, 'sitemap.xml'),
  'utf8',
)
if (!sitemap.includes('<?xml')) fail('sitemap not XML')
else pass('sitemap is XML')
const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])
if (!locs.length) fail('sitemap has no <loc>')
else pass(`sitemap has ${locs.length} URLs`)
for (const loc of locs) {
  if (!loc.startsWith('https://')) fail(`sitemap loc not HTTPS: ${loc}`)
}
if (!locs.some((l) => l === `${SITE}/` || l === SITE))
  warn(`Homepage ${SITE}/ not exactly in sitemap (found: ${locs[0]})`)
else pass('Homepage in sitemap')

// Validate sitemap URLs resolve (HEAD) — optional network
info('11) Live URL checks (network)')
async function headOk(url) {
  try {
    const res = await fetch(url, { method: 'HEAD', redirect: 'follow' })
    return { url, status: res.status, ok: res.ok }
  } catch (e) {
    return { url, status: 0, ok: false, error: e.message }
  }
}

const liveChecks = await Promise.all([
  headOk(`${SITE}/`),
  headOk(`${SITE}/robots.txt`),
  headOk(`${SITE}/sitemap.xml`),
  headOk(`${SITE}/manifest.webmanifest`),
  headOk(`${SITE}/og-image.svg`),
  headOk(`${SITE}/Resume.pdf`),
  headOk(`${SITE}/profile.png`),
])

for (const r of liveChecks) {
  if (r.ok || r.status === 200 || r.status === 304) pass(`LIVE ${r.status} ${r.url}`)
  else if (r.status === 405) {
    // some hosts reject HEAD
    const get = await fetch(r.url, { method: 'GET' }).catch(() => null)
    if (get?.ok) pass(`LIVE GET ${get.status} ${r.url}`)
    else warn(`LIVE fail ${r.status} ${r.url}`)
  } else warn(`LIVE ${r.status || 'ERR'} ${r.url}${r.error ? ` (${r.error})` : ''} — deploy may be stale`)
}

// Detect SPA fallback poisoning robots/sitemap
for (const path of ['/robots.txt', '/sitemap.xml']) {
  try {
    const res = await fetch(`${SITE}${path}`)
    const text = await res.text()
    if (/<!doctype html>/i.test(text)) {
      fail(
        `LIVE ${path} returns HTML (SPA rewrite) — redeploy with robots/sitemap in public/ + vercel.json fix`,
      )
    } else if (path === '/robots.txt' && /User-agent:/i.test(text)) {
      pass(`LIVE ${path} is plain robots.txt`)
    } else if (path === '/sitemap.xml' && /<urlset/i.test(text)) {
      pass(`LIVE ${path} is XML sitemap`)
    } else {
      warn(`LIVE ${path} unexpected body`)
    }
  } catch (e) {
    warn(`LIVE ${path} check failed: ${e.message}`)
  }
}

// Fetch live HTML and check meta
try {
  const liveHtml = await (await fetch(`${SITE}/`)).text()
  if (/<title>/i.test(liveHtml)) pass('Live HTML has <title>')
  if (/application\/ld\+json/i.test(liveHtml)) pass('Live HTML has JSON-LD')
  else warn('Live HTML missing JSON-LD — redeploy needed for latest SEO')
  if (/Windows\s*12/i.test(liveHtml)) warn('Live site still mentions Windows 12')
  else pass('Live site: no Windows 12 in HTML sample')
  const liveDesc = getAttr(liveHtml, 'meta', 'name', 'description')
  if (liveDesc && liveDesc.includes('Bhiwandi'))
    pass('Live description includes GEO (Bhiwandi)')
  else warn('Live description may be outdated vs local build')
} catch (e) {
  warn(`Could not fetch live HTML: ${e.message}`)
}

// ——— 12. Source component checks ———
info('12) Source SEO modules')
for (const f of [
  'src/seo/siteConfig.js',
  'src/seo/buildSchemas.js',
  'src/components/seo/SeoHead.jsx',
  'src/components/seo/SeoContent.jsx',
  'src/components/seo/Analytics.jsx',
  'scripts/generate-seo-files.mjs',
]) {
  if (existsSync(join(root, f))) pass(`Source: ${f}`)
  else fail(`Missing source: ${f}`)
}

const appSrc = readFileSync(join(root, 'src/App.jsx'), 'utf8')
if (!appSrc.includes('SeoHead')) fail('App.jsx missing SeoHead')
else pass('App.jsx mounts SeoHead')
if (!appSrc.includes('SeoContent')) fail('App.jsx missing SeoContent')
else pass('App.jsx mounts SeoContent')

const seoContent = readFileSync(join(root, 'src/components/seo/SeoContent.jsx'), 'utf8')
if (!seoContent.includes('<h1>')) fail('SeoContent missing H1')
else pass('SeoContent has H1')
if (!seoContent.includes('seo-faq')) fail('SeoContent missing FAQ section')
else pass('SeoContent has FAQ section')

const css = readFileSync(join(root, 'src/styles/tailwind.css'), 'utf8')
if (!css.includes('.seo-content')) fail('Missing .seo-content CSS')
else if (/display:\s*none/.test(css.match(/\.seo-content\s*\{[^}]+\}/)?.[0] || ''))
  fail('.seo-content uses display:none (bad for some crawlers)')
else pass('.seo-content is visually hidden (clip), not display:none')

// ——— 13. Schema builder unit check via vite-node-less dynamic import ———
info('13) Schema builder integrity')
try {
  // Minimal re-check: buildSchemas file exports expected symbols
  const buildSrc = readFileSync(join(root, 'src/seo/buildSchemas.js'), 'utf8')
  for (const fn of [
    'buildPersonSchema',
    'buildWebSiteSchema',
    'buildFaqSchema',
    'buildPortfolioSchema',
    'buildAllSchemas',
  ]) {
    if (!buildSrc.includes(`export function ${fn}`)) fail(`Missing export ${fn}`)
    else pass(`Export ${fn}`)
  }
} catch (e) {
  fail(e.message)
}

// ——— Report ———
console.log('\n---------- RESULTS ----------')
console.log(`PASS: ${results.pass.length}`)
console.log(`WARN: ${results.warn.length}`)
console.log(`FAIL: ${results.fail.length}`)
console.log('')

if (results.fail.length) {
  console.log('FAILURES:')
  results.fail.forEach((m) => console.log(`  ✗ ${m}`))
  console.log('')
}
if (results.warn.length) {
  console.log('WARNINGS:')
  results.warn.forEach((m) => console.log(`  ! ${m}`))
  console.log('')
}

console.log('PASSES (sample):')
results.pass.slice(0, 25).forEach((m) => console.log(`  ✓ ${m}`))
if (results.pass.length > 25)
  console.log(`  … +${results.pass.length - 25} more`)

const score = Math.round(
  (results.pass.length /
    Math.max(1, results.pass.length + results.fail.length * 2 + results.warn.length * 0.5)) *
    100,
)
console.log(`\nSEO health score (heuristic): ${score}/100`)
console.log('================================\n')

if (results.fail.length) process.exitCode = 1
