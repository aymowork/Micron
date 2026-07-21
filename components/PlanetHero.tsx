'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

// Continents: [longitude_degrees, latitude_degrees][]
const CONTINENTS: [number, number][][] = [
  // North America
  [[-168,71],[-130,70],[-95,72],[-65,68],[-55,47],[-68,44],[-82,42],[-80,25],[-90,16],[-85,10],[-77,8],
   [-80,0],[-80,12],[-92,16],[-105,22],[-117,32],[-124,37],[-140,60],[-168,71]],
  // Greenland
  [[-65,82],[-18,82],[-18,62],[-50,60],[-65,76]],
  // South America
  [[-82,10],[-62,12],[-37,-5],[-36,-22],[-52,-55],[-70,-55],[-80,5],[-82,10]],
  // Europe (simplified)
  [[-10,36],[10,36],[28,36],[42,38],[45,44],[30,60],[25,70],[0,70],[-10,58],[-10,36]],
  // Africa
  [[-17,15],[37,15],[52,12],[44,-10],[35,-35],[18,-35],[10,-18],[0,5],[-17,15]],
  // Asia (main)
  [[30,70],[65,72],[95,73],[135,72],[180,68],[180,10],[140,1],[105,1],
   [80,8],[65,22],[55,12],[42,12],[37,15],[25,40],[30,70]],
  // Indian subcontinent
  [[65,22],[92,22],[80,8],[65,8],[65,22]],
  // Japan
  [[130,45],[145,45],[145,31],[130,31]],
  // British Isles
  [[-8,61],[2,61],[2,50],[-8,50]],
  // Australia
  [[114,-15],[155,-15],[155,-44],[128,-38],[114,-26]],
  // New Guinea
  [[132,-1],[148,-1],[148,-10],[132,-8]],
  // Antarctica
  [[-180,-65],[180,-65],[180,-90],[-180,-90]],
  // Iceland
  [[-25,67],[-13,67],[-13,63],[-25,63]],
  // Madagascar
  [[44,-12],[50,-12],[50,-26],[44,-24]],
  // Indonesia (rough)
  [[95,6],[120,4],[140,-2],[140,-10],[120,-9],[95,0]],
]

// City positions [lon_rad, lat_rad, brightness]
const CITIES: [number, number, number][] = [
  [2.35, 0.85, 1.0],    // Paris
  [-0.12, 0.89, 0.9],   // London
  [13.4, 0.91, 0.85],   // Berlin
  [28.0, 0.72, 0.8],    // Istanbul
  [37.6, 0.97, 0.8],    // Moscow
  [55.8, 0.43, 0.85],   // Dubai
  [72.8, 0.33, 0.9],    // Mumbai
  [77.2, 0.5, 0.85],    // Delhi
  [116.4, 0.7, 1.0],    // Beijing
  [121.5, 0.55, 0.95],  // Shanghai
  [126.9, 0.65, 0.9],   // Seoul
  [139.7, 0.62, 0.95],  // Tokyo
  [151.2, -0.59, 0.8],  // Sydney
  [103.8, 0.02, 0.85],  // Singapore
  [-73.9, 0.71, 1.0],   // New York
  [-87.6, 0.73, 0.9],   // Chicago
  [-118.2, 0.59, 0.9],  // LA
  [-43.2, -0.4, 0.85],  // Rio
  [-58.4, -0.6, 0.8],   // Buenos Aires
  [-99.1, 0.34, 0.9],   // Mexico City
  [31.2, 0.53, 0.8],    // Cairo
  [18.4, -0.59, 0.75],  // Cape Town
].map(([lon, lat, b]) => [lon * Math.PI / 180, lat * Math.PI / 180, b])

// Contamination epicenters [lon_rad, lat_rad, initial_size, max_size]
const CONTAM: { lon: number; lat: number; size: number; max: number }[] = [
  { lon: 2.35 * Math.PI / 180, lat: 48.8 * Math.PI / 180, size: 0.04, max: 0.52 },
  { lon: -73.9 * Math.PI / 180, lat: 40.7 * Math.PI / 180, size: 0.03, max: 0.48 },
  { lon: 116 * Math.PI / 180, lat: 39 * Math.PI / 180, size: 0.03, max: 0.45 },
  { lon: -43 * Math.PI / 180, lat: -22 * Math.PI / 180, size: 0.02, max: 0.38 },
]

const TEX_W = 512
const TEX_H = 256
const TWO_PI = Math.PI * 2
const HALF_PI = Math.PI / 2

export function PlanetHero() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')!

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    // ── BUILD EARTH TEXTURE ─────────────────────────────────────
    const texCanvas = document.createElement('canvas')
    texCanvas.width = TEX_W
    texCanvas.height = TEX_H
    const tCtx = texCanvas.getContext('2d')!

    // Deep ocean
    tCtx.fillStyle = '#030e1a'
    tCtx.fillRect(0, 0, TEX_W, TEX_H)

    // Continents
    CONTINENTS.forEach(polygon => {
      tCtx.beginPath()
      polygon.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * TEX_W
        const y = ((90 - lat) / 180) * TEX_H
        i === 0 ? tCtx.moveTo(x, y) : tCtx.lineTo(x, y)
      })
      tCtx.closePath()
      tCtx.fillStyle = '#0f2212'
      tCtx.fill()
      // Subtle coastline
      tCtx.strokeStyle = '#162a18'
      tCtx.lineWidth = 0.5
      tCtx.stroke()
    })

    // North polar ice cap (lat > 72°)
    const iceN = ((90 - 72) / 180) * TEX_H
    const gN = tCtx.createLinearGradient(0, 0, 0, iceN)
    gN.addColorStop(0, 'rgba(210,235,245,0.95)')
    gN.addColorStop(1, 'rgba(210,235,245,0)')
    tCtx.fillStyle = gN
    tCtx.fillRect(0, 0, TEX_W, iceN)

    // South polar ice cap (lat < -65°)
    const iceS = ((90 + 65) / 180) * TEX_H
    const gS = tCtx.createLinearGradient(0, iceS, 0, TEX_H)
    gS.addColorStop(0, 'rgba(210,235,245,0)')
    gS.addColorStop(1, 'rgba(210,235,245,0.95)')
    tCtx.fillStyle = gS
    tCtx.fillRect(0, iceS, TEX_W, TEX_H - iceS)

    // Ocean shallow gradient near coasts (subtle)
    tCtx.globalAlpha = 0.2
    CONTINENTS.forEach(polygon => {
      tCtx.beginPath()
      polygon.forEach(([lon, lat], i) => {
        const x = ((lon + 180) / 360) * TEX_W
        const y = ((90 - lat) / 180) * TEX_H
        i === 0 ? tCtx.moveTo(x, y) : tCtx.lineTo(x, y)
      })
      tCtx.closePath()
      tCtx.lineWidth = 5
      tCtx.strokeStyle = '#0a1f28'
      tCtx.stroke()
    })
    tCtx.globalAlpha = 1

    // City lights as tiny dots (will be seen on night side)
    CITIES.forEach(([lon, lat]) => {
      const x = ((lon * 180 / Math.PI + 180) / 360) * TEX_W
      const y = ((90 - lat * 180 / Math.PI) / 180) * TEX_H
      const g = tCtx.createRadialGradient(x, y, 0, x, y, 4)
      g.addColorStop(0, 'rgba(255,220,120,0.9)')
      g.addColorStop(1, 'rgba(255,220,120,0)')
      tCtx.fillStyle = g
      tCtx.beginPath()
      tCtx.arc(x, y, 4, 0, TWO_PI)
      tCtx.fill()
    })

    const texImgData = tCtx.getImageData(0, 0, TEX_W, TEX_H)
    const texPx = texImgData.data

    // ── BACKGROUND STARS ────────────────────────────────────────
    const stars = Array.from({ length: 250 }, () => ({
      x: Math.random(), y: Math.random(),
      r: 0.3 + Math.random() * 1.2,
      a: 0.15 + Math.random() * 0.7,
    }))

    // ── STATE ────────────────────────────────────────────────────
    const contam = CONTAM.map(z => ({ ...z }))
    let rotation = 0
    let cloudRot = 0
    let frame = 0
    let raf: number

    const CLOUD_POS = [
      { lon: 0.5, lat: 0.3 }, { lon: 2.2, lat: -0.1 },
      { lon: 3.8, lat: 0.5 }, { lon: 1.4, lat: -0.4 },
      { lon: 5.0, lat: 0.2 }, { lon: 0.1, lat: -0.6 },
    ]

    const draw = () => {
      const W = canvas.width
      const H = canvas.height
      const R = Math.min(W, H) * 0.30
      const cx = W / 2
      const cy = H / 2
      const SCALE = 2

      ctx.clearRect(0, 0, W, H)

      // ── STARS ────────────────────────────────────────────────
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x * W, s.y * H, s.r, 0, TWO_PI)
        ctx.fillStyle = `rgba(255,255,255,${s.a})`
        ctx.fill()
      }

      // ── SPHERE PIXEL RENDER ──────────────────────────────────
      const diam = Math.ceil(R * 2)
      const sImg = ctx.createImageData(diam, diam)
      const sd = sImg.data

      // Sun direction (upper-left, slightly toward viewer)
      const SX = -0.45, SY = 0.35, SZ = 0.82

      for (let py = 0; py < diam; py += SCALE) {
        for (let px = 0; px < diam; px += SCALE) {
          const nx = (px - R) / R
          const ny = -(py - R) / R  // flip Y
          const d2 = nx * nx + ny * ny
          if (d2 >= 0.9998) continue

          const nz = Math.sqrt(1 - d2)

          // Sphere → lon/lat
          const lat = Math.asin(Math.max(-1, Math.min(1, ny)))
          const cosLat = Math.sqrt(1 - ny * ny)
          const sinL = cosLat > 0.001 ? Math.max(-1, Math.min(1, nx / cosLat)) : 0
          const cosL = cosLat > 0.001 ? nz / cosLat : 1
          let lon = Math.atan2(sinL, cosL) - rotation
          lon = ((lon % TWO_PI) + TWO_PI) % TWO_PI

          // Sample texture
          const tx = Math.min(TEX_W - 1, Math.floor(lon / TWO_PI * TEX_W))
          const ty = Math.min(TEX_H - 1, Math.floor((HALF_PI - lat) / Math.PI * TEX_H))
          const ti = (ty * TEX_W + tx) * 4
          let r = texPx[ti]
          let g = texPx[ti + 1]
          let b = texPx[ti + 2]

          // Contamination: green zones spreading from epicenters
          let cs = 0
          for (const z of contam) {
            let dLon = Math.abs(lon - ((z.lon % TWO_PI + TWO_PI) % TWO_PI))
            if (dLon > Math.PI) dLon = TWO_PI - dLon
            const dLat = Math.abs(lat - z.lat)
            // Organic look: noise via sin
            const noise = 1 + 0.3 * Math.sin(lon * 8 + z.lon) * Math.sin(lat * 8 + z.lat)
            const dist = Math.sqrt(dLon * dLon * Math.cos(lat) * Math.cos(lat) + dLat * dLat) / noise
            if (dist < z.size) {
              cs = Math.max(cs, (1 - dist / z.size))
            }
          }
          if (cs > 0) {
            // Green contamination tint — more intense on land
            const isLand = g > r  // land pixels have more green
            const intensity = cs * (isLand ? 0.85 : 0.45)
            r = r * (1 - intensity * 0.8) + 10 * intensity
            g = g * (1 - intensity * 0.4) + 120 * intensity
            b = b * (1 - intensity * 0.8) + 8 * intensity
          }

          // Lighting
          const diffuse = nx * SX + ny * SY + nz * SZ
          const light = Math.max(0, diffuse)
          const ambient = 0.06
          const lit = ambient + light * 0.94

          // City lights on dark side
          if (diffuse < 0.12) {
            const nightFactor = Math.max(0, 1 - diffuse / 0.12)
            for (const [cLon, cLat, br] of CITIES) {
              let dL = Math.abs(lon - ((cLon % TWO_PI + TWO_PI) % TWO_PI))
              if (dL > Math.PI) dL = TWO_PI - dL
              const dLa = Math.abs(lat - cLat)
              const dist = Math.sqrt(dL * dL * Math.cos(lat) * Math.cos(lat) + dLa * dLa)
              if (dist < 0.06) {
                const ci = (1 - dist / 0.06) * br * nightFactor * 0.9
                r = Math.min(255, r + 255 * ci * 0.6)
                g = Math.min(255, g + 200 * ci * 0.45)
                b = Math.min(255, b + 100 * ci * 0.2)
              }
            }
          }

          // Specular highlight on ocean
          if (r < 25 && g < 35) {  // ocean pixel
            const spec = Math.pow(Math.max(0, nz * SZ + nx * SX + ny * SY), 12) * 0.4
            r = Math.min(255, r + spec * 60)
            g = Math.min(255, g + spec * 80)
            b = Math.min(255, b + spec * 120)
          }

          r = Math.min(255, r * lit)
          g = Math.min(255, g * lit)
          b = Math.min(255, b * lit)

          // Horizon fade to transparency
          const edgeFade = Math.pow(nz, 0.4)

          // Fill SCALE × SCALE block
          for (let dy = 0; dy < SCALE && py + dy < diam; dy++) {
            for (let dx = 0; dx < SCALE && px + dx < diam; dx++) {
              const i = ((py + dy) * diam + (px + dx)) * 4
              sd[i] = r
              sd[i + 1] = g
              sd[i + 2] = b
              sd[i + 3] = Math.floor(edgeFade * 255)
            }
          }
        }
      }
      ctx.putImageData(sImg, Math.floor(cx - R), Math.floor(cy - R))

      // ── CLOUDS ──────────────────────────────────────────────
      ctx.save()
      ctx.beginPath()
      ctx.arc(cx, cy, R, 0, TWO_PI)
      ctx.clip()
      for (const c of CLOUD_POS) {
        const adjLon = (c.lon + cloudRot) % TWO_PI
        const cl = Math.cos(c.lat)
        const x3 = Math.sin(adjLon) * cl
        const z3 = Math.cos(adjLon) * cl
        if (z3 < 0) continue
        const y3 = Math.sin(c.lat)
        const scx = cx + x3 * R
        const scy = cy - y3 * R
        const depth = (z3 + 1) / 2
        const cr = 0.24 * R * depth
        const cg = ctx.createRadialGradient(scx, scy, 0, scx, scy, cr)
        cg.addColorStop(0, `rgba(255,255,255,${0.14 * depth})`)
        cg.addColorStop(0.5, `rgba(255,255,255,${0.06 * depth})`)
        cg.addColorStop(1, 'rgba(255,255,255,0)')
        ctx.beginPath()
        ctx.ellipse(scx, scy, cr, cr * 0.45, 0, 0, TWO_PI)
        ctx.fillStyle = cg
        ctx.fill()
      }
      ctx.restore()

      // ── ATMOSPHERE ──────────────────────────────────────────
      // Blue limb (day side)
      const ag = ctx.createRadialGradient(cx - R * 0.15, cy - R * 0.15, R * 0.88, cx, cy, R * 1.1)
      ag.addColorStop(0, 'rgba(40,100,180,0)')
      ag.addColorStop(0.6, 'rgba(40,100,180,0.18)')
      ag.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.1, 0, TWO_PI)
      ctx.fillStyle = ag; ctx.fill()

      // Green contamination corona
      const contamPct = contam.reduce((s, z) => s + z.size / z.max, 0) / contam.length
      const cg2 = ctx.createRadialGradient(cx, cy, R * 0.96, cx, cy, R * 1.07)
      cg2.addColorStop(0, `rgba(57,255,20,${0.05 + contamPct * 0.12})`)
      cg2.addColorStop(1, 'rgba(57,255,20,0)')
      ctx.beginPath(); ctx.arc(cx, cy, R * 1.07, 0, TWO_PI)
      ctx.fillStyle = cg2; ctx.fill()

      // Planet border
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TWO_PI)
      ctx.strokeStyle = 'rgba(57,255,20,0.08)'; ctx.lineWidth = 1; ctx.stroke()

      // ── ORBIT RING + SATELLITE ───────────────────────────────
      ctx.save()
      ctx.beginPath()
      ctx.ellipse(cx, cy, R * 1.5, R * 0.38, -0.28, 0, TWO_PI)
      ctx.strokeStyle = 'rgba(57,255,20,0.07)'
      ctx.lineWidth = 1; ctx.setLineDash([4, 7]); ctx.stroke(); ctx.setLineDash([])
      ctx.restore()

      const sa = frame * 0.009
      const sx = cx + Math.cos(sa) * R * 1.5
      const sy = cy + Math.sin(sa) * R * 0.38
      ctx.beginPath(); ctx.arc(sx, sy, 2, 0, TWO_PI)
      ctx.fillStyle = '#39ff14'
      ctx.shadowColor = '#39ff14'; ctx.shadowBlur = 10; ctx.fill(); ctx.shadowBlur = 0

      // ── SCANLINES ───────────────────────────────────────────
      ctx.save()
      ctx.beginPath(); ctx.arc(cx, cy, R, 0, TWO_PI); ctx.clip()
      for (let sy2 = cy - R; sy2 < cy + R; sy2 += 4) {
        ctx.fillStyle = 'rgba(0,0,0,0.04)'
        ctx.fillRect(cx - R, sy2, R * 2, 1)
      }
      ctx.restore()

      // Update
      rotation += 0.004
      cloudRot += 0.0055
      frame++
      for (const z of contam) if (z.size < z.max) z.size += 0.00035

      raf = requestAnimationFrame(draw)
    }

    raf = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize) }
  }, [])

  return (
    <div style={{ position: 'relative', height: '100vh', overflow: 'hidden', background: '#000' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', pointerEvents: 'none' }} />

      {/* HUD top-left — satellite readout */}
      <div style={{ position: 'absolute', top: '100px', left: '40px', zIndex: 10, pointerEvents: 'none' }}>
        {['MICRON.SYS v2.4', 'ORBIT: 420KM', 'STATUS: SPREADING', 'VECTOR: AIRBORNE'].map((line, i) => (
          <p key={i} style={{
            fontFamily: 'Space Mono, monospace', fontSize: '9px',
            letterSpacing: '0.15em', color: '#1e1e1e', lineHeight: 2.2,
          }}>{line}</p>
        ))}
      </div>

      {/* HUD top-right */}
      <div style={{ position: 'absolute', top: '100px', right: '40px', zIndex: 10, pointerEvents: 'none', textAlign: 'right' }}>
        {['48°52\'N  2°21\'E', 'T+' + String(Date.now()).slice(-6), 'CONTAM: ACTIVE'].map((line, i) => (
          <p key={i} style={{
            fontFamily: 'Space Mono, monospace', fontSize: '9px',
            letterSpacing: '0.15em', color: '#1e1e1e', lineHeight: 2.2,
          }}>{line}</p>
        ))}
      </div>

      {/* Main brand overlay — bottom center */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 10,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'flex-end',
        paddingBottom: '9vh', pointerEvents: 'none',
      }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginBottom: '18px' }}>
          <span style={{
            display: 'block', width: '6px', height: '6px', borderRadius: '50%',
            background: '#39ff14', boxShadow: '0 0 8px #39ff14',
            animation: 'pulse 2s infinite',
          }} />
          <span style={{ fontFamily: 'Space Mono, monospace', fontSize: '10px', letterSpacing: '0.3em', color: '#39ff14' }}>
            CONTAMINATION MONDIALE
          </span>
        </div>

        <h1 style={{
          fontFamily: 'Syne, sans-serif', fontWeight: 800,
          fontSize: 'clamp(52px, 7.5vw, 96px)',
          letterSpacing: '0.15em', color: '#fff', lineHeight: 1,
          marginBottom: '10px', textAlign: 'center',
          textShadow: '0 0 80px rgba(57,255,20,0.18)',
        }}>
          MICRON
        </h1>

        <p style={{
          fontFamily: 'Space Mono, monospace', fontSize: 'clamp(9px, 1.1vw, 12px)',
          letterSpacing: '0.3em', color: '#3a3a3a', marginBottom: '30px',
        }}>
          LIVE UR LIFE <span style={{ color: '#222' }}>(FAST IF ITS POSSIBLE)</span>
        </p>

        <div style={{ display: 'flex', gap: '12px', pointerEvents: 'auto' }}>
          <Link href="/shop" style={{
            padding: '13px 36px', background: '#fff', color: '#000',
            fontFamily: 'Space Mono, monospace', fontSize: '11px',
            fontWeight: 700, letterSpacing: '0.2em', textDecoration: 'none',
          }}>
            ENTER SHOP
          </Link>
          <Link href="/archive" style={{
            padding: '13px 36px', background: 'transparent', color: '#fff',
            border: '1px solid #222', fontFamily: 'Space Mono, monospace',
            fontSize: '11px', letterSpacing: '0.2em', textDecoration: 'none',
          }}>
            ARCHIVE
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.3} }
      `}</style>
    </div>
  )
}
