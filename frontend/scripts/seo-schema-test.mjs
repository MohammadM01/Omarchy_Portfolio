/**
 * Validate runtime JSON-LD from buildSchemas via vite-node-compatible import.
 */
import { buildAllSchemas } from '../src/seo/buildSchemas.js'
import { FAQ_ITEMS, SITE_URL, DEFAULT_DESCRIPTION, DEFAULT_TITLE } from '../src/seo/siteConfig.js'

const schemas = buildAllSchemas()
const errors = []
const ok = []

function check(cond, msg) {
  if (cond) ok.push(msg)
  else errors.push(msg)
}

check(schemas.length >= 7, `schema count ${schemas.length} >= 7`)
const byType = Object.fromEntries(
  schemas.map((s) => [s['@type'], s]),
)

check(byType.Person?.name === 'Mohammad Mulla', 'Person.name')
check(byType.Person?.jobTitle?.includes('Software'), 'Person.jobTitle')
check(Array.isArray(byType.Person?.sameAs) && byType.Person.sameAs.length >= 2, 'Person.sameAs')
check(byType.Person?.address?.addressLocality === 'Bhiwandi', 'Person GEO locality')
check(byType.WebSite?.url === SITE_URL || byType.WebSite?.url?.startsWith('http'), 'WebSite.url')
check(byType.FAQPage?.mainEntity?.length === FAQ_ITEMS.length, 'FAQ count matches config')
check(
  byType.CollectionPage?.mainEntity?.itemListElement?.length >= 3,
  'Portfolio ItemList has projects',
)
check(byType.Place?.geo?.latitude != null, 'Place geo coords')
check(!JSON.stringify(schemas).includes('Windows 12'), 'No Windows 12 in schemas')
check(DEFAULT_TITLE.length >= 30 && DEFAULT_TITLE.length <= 70, `title length ${DEFAULT_TITLE.length}`)
check(
  DEFAULT_DESCRIPTION.length >= 70 && DEFAULT_DESCRIPTION.length <= 170,
  `desc length ${DEFAULT_DESCRIPTION.length}`,
)

// Ensure JSON serializable (no circular)
try {
  JSON.stringify(schemas)
  ok.push('schemas JSON-serializable')
} catch (e) {
  errors.push(`JSON serialize failed: ${e.message}`)
}

// Required FAQ AEO questions
const qNames = (byType.FAQPage?.mainEntity || []).map((q) => q.name)
for (const need of ['Who is Mohammad Mulla?', 'How can I contact Mohammad Mulla?']) {
  check(qNames.includes(need), `FAQ includes "${need}"`)
}

console.log('\n========== SCHEMA UNIT TEST ==========\n')
ok.forEach((m) => console.log(' ✓', m))
errors.forEach((m) => console.log(' ✗', m))
console.log(`\n${ok.length} passed, ${errors.length} failed`)
console.log('SITE_URL =', SITE_URL)
console.log('======================================\n')
if (errors.length) process.exitCode = 1
