import { HOST_NAME } from '../constants'

/**
 * Best-effort network info for the terminal `ipconfig` command.
 * Browsers cannot expose Wi‑Fi SSID / SIM display name (privacy).
 * We use Network Information API + WebRTC local IP + public geo/ISP lookup.
 */

function getConnectionMeta() {
  const c =
    typeof navigator !== 'undefined'
      ? navigator.connection ||
        navigator.mozConnection ||
        navigator.webkitConnection
      : null

  return {
    online: typeof navigator !== 'undefined' ? navigator.onLine : true,
    type: c?.type || 'unknown', // wifi | cellular | ethernet | none | …
    effectiveType: c?.effectiveType || null, // 4g | 3g | …
    downlink: typeof c?.downlink === 'number' ? c.downlink : null,
    rtt: typeof c?.rtt === 'number' ? c.rtt : null,
    saveData: Boolean(c?.saveData),
  }
}

function guessSubnet(ip) {
  if (!ip || ip.includes(':')) return 'ffff:ffff:ffff:ffff::'
  const parts = ip.split('.').map(Number)
  if (parts[0] === 10) return '255.0.0.0'
  if (parts[0] === 172 && parts[1] >= 16 && parts[1] <= 31) return '255.255.0.0'
  if (parts[0] === 192 && parts[1] === 168) return '255.255.255.0'
  return '255.255.255.0'
}

function guessGateway(ip) {
  if (!ip || ip.includes(':')) return ''
  const parts = ip.split('.')
  if (parts.length !== 4) return ''
  return `${parts[0]}.${parts[1]}.${parts[2]}.1`
}

/** Collect host candidate IPs via WebRTC (local LAN). */
function discoverLocalIps(timeoutMs = 1600) {
  return new Promise((resolve) => {
    const ips = new Set()
    let pc
    const finish = () => {
      try {
        pc?.close()
      } catch {
        /* ignore */
      }
      resolve([...ips])
    }

    const timer = window.setTimeout(finish, timeoutMs)

    try {
      const RTCPeer =
        window.RTCPeerConnection ||
        window.webkitRTCPeerConnection ||
        window.mozRTCPeerConnection
      if (!RTCPeer) {
        window.clearTimeout(timer)
        resolve([])
        return
      }

      pc = new RTCPeer({ iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] })
      pc.createDataChannel('ipconfig')
      pc.onicecandidate = (e) => {
        const cand = e.candidate?.candidate
        if (!cand) return
        const m = /([0-9]{1,3}(?:\.[0-9]{1,3}){3})/.exec(cand)
        if (m) {
          const ip = m[1]
          // Skip link-local / obvious invalids
          if (!ip.startsWith('0.') && !ip.startsWith('127.')) ips.add(ip)
        }
        if (e.candidate === null) {
          window.clearTimeout(timer)
          finish()
        }
      }
      pc.createOffer()
        .then((offer) => pc.setLocalDescription(offer))
        .catch(() => {
          window.clearTimeout(timer)
          finish()
        })
    } catch {
      window.clearTimeout(timer)
      finish()
    }
  })
}

async function fetchPublicProfile() {
  const controllers = []
  const tryFetch = async (url, map) => {
    const ctrl = new AbortController()
    controllers.push(ctrl)
    const t = window.setTimeout(() => ctrl.abort(), 3500)
    try {
      const res = await fetch(url, { signal: ctrl.signal, cache: 'no-store' })
      if (!res.ok) throw new Error('bad status')
      const data = await res.json()
      return map(data)
    } finally {
      window.clearTimeout(t)
    }
  }

  try {
    return await tryFetch('https://ipapi.co/json/', (d) => ({
      publicIp: d.ip || null,
      city: d.city || null,
      region: d.region || null,
      country: d.country_name || d.country || null,
      org: d.org || d.asn || null,
      asn: d.asn || null,
      timezone: d.timezone || null,
    }))
  } catch {
    /* fall through */
  }

  try {
    return await tryFetch('https://ipwho.is/', (d) => ({
      publicIp: d.success === false ? null : d.ip,
      city: d.city || null,
      region: d.region || null,
      country: d.country || null,
      org: d.connection?.isp || d.connection?.org || null,
      asn: d.connection?.asn ? `AS${d.connection.asn}` : null,
      timezone: d.timezone?.id || null,
    }))
  } catch {
    /* fall through */
  }

  try {
    return await tryFetch('https://api.ipify.org?format=json', (d) => ({
      publicIp: d.ip || null,
      city: null,
      region: null,
      country: null,
      org: null,
      asn: null,
      timezone: null,
    }))
  } catch {
    return {
      publicIp: null,
      city: null,
      region: null,
      country: null,
      org: null,
      asn: null,
      timezone: null,
    }
  }
}

function classifyAdapter(conn) {
  const t = String(conn.type || '').toLowerCase()
  if (t === 'wifi' || t === 'wimax') {
    return {
      kind: 'wifi',
      title: 'Wireless LAN adapter Wi-Fi:',
      media: 'Wi-Fi',
    }
  }
  if (t === 'cellular') {
    return {
      kind: 'cellular',
      title: 'Cellular adapter Mobile Broadband:',
      media: 'Cellular / SIM',
    }
  }
  if (t === 'ethernet') {
    return {
      kind: 'ethernet',
      title: 'Ethernet adapter Ethernet:',
      media: 'Ethernet',
    }
  }
  if (!conn.online || t === 'none') {
    return {
      kind: 'offline',
      title: 'Media disconnected',
      media: 'Offline',
    }
  }
  // Many desktops report "unknown" even on Wi‑Fi — prefer Wi‑Fi label when online
  return {
    kind: 'wifi',
    title: 'Wireless LAN adapter Wi-Fi:',
    media: 'Wi-Fi / Network',
  }
}

function networkDisplayName(adapter, publicInfo, conn) {
  const org = (publicInfo.org || '').trim()
  if (adapter.kind === 'cellular') {
    // ISP string often includes carrier (Jio, Airtel, VI, …)
    if (org) return org.replace(/^AS\d+\s+/i, '')
    return 'Mobile data (carrier name unavailable)'
  }
  if (adapter.kind === 'wifi') {
    if (org) return org.replace(/^AS\d+\s+/i, '')
    return 'Connected Wi‑Fi (SSID hidden by browser)'
  }
  if (adapter.kind === 'ethernet') {
    return org ? org.replace(/^AS\d+\s+/i, '') : 'Ethernet'
  }
  if (conn.effectiveType) return `Link (${conn.effectiveType})`
  return 'Unknown network'
}

/**
 * @returns {Promise<object>}
 */
export async function getNetworkInfo() {
  const conn = getConnectionMeta()
  const [localIps, publicInfo] = await Promise.all([
    discoverLocalIps(),
    fetchPublicProfile(),
  ])

  const ipv4 = localIps.find((ip) => !ip.includes(':')) || null
  const ipv6 = localIps.find((ip) => ip.includes(':')) || null
  const adapter = classifyAdapter(conn)
  const networkName = networkDisplayName(adapter, publicInfo, conn)

  return {
    conn,
    adapter,
    networkName,
    localIpv4: ipv4,
    localIpv6: ipv6,
    subnet: guessSubnet(ipv4),
    gateway: guessGateway(ipv4),
    publicInfo,
  }
}

/**
 * Format like classic `ipconfig` / `ipconfig /all` (compact).
 * @param {Awaited<ReturnType<typeof getNetworkInfo>>} info
 */
export function formatIpConfigLines(info) {
  const {
    conn,
    adapter,
    networkName,
    localIpv4,
    localIpv6,
    subnet,
    gateway,
    publicInfo,
  } = info

  const lines = [
    { type: 'accent', text: 'IP Configuration' },
    { type: 'dim', text: '' },
    {
      type: 'plain',
      text: `   Host Name . . . . . . . . . . . . : ${HOST_NAME}`,
    },
    {
      type: 'plain',
      text: `   Online status . . . . . . . . . . : ${conn.online ? 'Yes' : 'No'}`,
    },
    {
      type: 'plain',
      text: `   Link type  . . . . . . . . . . . : ${conn.type || 'unknown'}${
        conn.effectiveType ? ` (${conn.effectiveType})` : ''
      }`,
    },
  ]

  if (conn.downlink != null) {
    lines.push({
      type: 'plain',
      text: `   Approximate bandwidth . . . . . : ${conn.downlink} Mbps`,
    })
  }
  if (conn.rtt != null) {
    lines.push({
      type: 'plain',
      text: `   Estimated RTT . . . . . . . . . : ${conn.rtt} ms`,
    })
  }

  lines.push({ type: 'dim', text: '' })

  if (adapter.kind === 'offline') {
    lines.push({ type: 'accent', text: 'Media State' })
    lines.push({ type: 'dim', text: '' })
    lines.push({
      type: 'plain',
      text: '   Media State . . . . . . . . . . . : Media disconnected',
    })
    return lines
  }

  lines.push({ type: 'accent', text: adapter.title })
  lines.push({ type: 'dim', text: '' })
  lines.push({
    type: 'plain',
    text: `   Description . . . . . . . . . . . : ${adapter.media}`,
  })
  lines.push({
    type: 'plain',
    text: `   Network / ISP name . . . . . . . : ${networkName}`,
  })

  if (adapter.kind === 'wifi') {
    lines.push({
      type: 'dim',
      text: '   SSID . . . . . . . . . . . . . . . : (not exposed by browser)',
    })
  }
  if (adapter.kind === 'cellular') {
    lines.push({
      type: 'dim',
      text: '   SIM display name . . . . . . . . . : (not exposed by browser)',
    })
  }

  lines.push({
    type: 'plain',
    text: `   DHCP Enabled. . . . . . . . . . . : Yes`,
  })
  lines.push({
    type: 'plain',
    text: `   Autoconfiguration Enabled . . . . : Yes`,
  })

  if (localIpv4) {
    lines.push({
      type: 'plain',
      text: `   IPv4 Address. . . . . . . . . . . : ${localIpv4}`,
    })
    lines.push({
      type: 'plain',
      text: `   Subnet Mask . . . . . . . . . . . : ${subnet}`,
    })
    if (gateway) {
      lines.push({
        type: 'plain',
        text: `   Default Gateway . . . . . . . . . : ${gateway}`,
      })
    }
  } else {
    lines.push({
      type: 'dim',
      text: '   IPv4 Address. . . . . . . . . . . : (probing LAN… unavailable)',
    })
  }

  if (localIpv6) {
    lines.push({
      type: 'plain',
      text: `   Link-local IPv6 Address . . . . . : ${localIpv6}`,
    })
  }

  if (publicInfo.publicIp) {
    lines.push({
      type: 'plain',
      text: `   Public IPv4 . . . . . . . . . . . : ${publicInfo.publicIp}`,
    })
  }

  if (publicInfo.org) {
    lines.push({
      type: 'plain',
      text: `   ISP / Carrier . . . . . . . . . . : ${publicInfo.org}`,
    })
  }

  const loc = [publicInfo.city, publicInfo.region, publicInfo.country]
    .filter(Boolean)
    .join(', ')
  if (loc) {
    lines.push({
      type: 'plain',
      text: `   Geo / Network region . . . . . . : ${loc}`,
    })
  }

  if (publicInfo.timezone) {
    lines.push({
      type: 'plain',
      text: `   Time Zone . . . . . . . . . . . . : ${publicInfo.timezone}`,
    })
  }

  lines.push({ type: 'dim', text: '' })
  lines.push({
    type: 'dim',
    text: 'Note: Browsers block Wi‑Fi SSID & SIM labels. Showing live link type, LAN IP, public IP & ISP.',
  })

  return lines
}
