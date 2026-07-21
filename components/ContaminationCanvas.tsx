'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  life: number; maxLife: number
  size: number
}

export function ContaminationCanvas() {
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

    const particles: Particle[] = []
    const MAX = 60

    const spawn = () => {
      if (particles.length >= MAX) return
      const edge = Math.floor(Math.random() * 4)
      let x = 0, y = 0
      if (edge === 0) { x = Math.random() * canvas.width; y = 0 }
      else if (edge === 1) { x = canvas.width; y = Math.random() * canvas.height }
      else if (edge === 2) { x = Math.random() * canvas.width; y = canvas.height }
      else { x = 0; y = Math.random() * canvas.height }

      const angle = Math.random() * Math.PI * 2
      const speed = 0.3 + Math.random() * 0.5
      const life = 200 + Math.random() * 300

      particles.push({
        x, y,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life, maxLife: life,
        size: 1 + Math.random() * 2,
      })
    }

    let frame = 0
    let raf: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      frame++
      if (frame % 8 === 0) spawn()

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        p.life--

        if (p.life <= 0) { particles.splice(i, 1); continue }

        const alpha = (p.life / p.maxLife) * 0.4
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(57, 255, 20, ${alpha})`
        ctx.fill()

        // pulse ring on new particles
        if (p.life > p.maxLife - 30) {
          const progress = 1 - (p.life - (p.maxLife - 30)) / 30
          ctx.beginPath()
          ctx.arc(p.x, p.y, p.size + progress * 12, 0, Math.PI * 2)
          ctx.strokeStyle = `rgba(57, 255, 20, ${0.2 * (1 - progress)})`
          ctx.lineWidth = 0.5
          ctx.stroke()
        }
      }

      raf = requestAnimationFrame(draw)
    }
    raf = requestAnimationFrame(draw)

    return () => {
      window.removeEventListener('resize', resize)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 1,
      }}
    />
  )
}
