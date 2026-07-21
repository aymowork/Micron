'use client'

import { useEffect, useRef } from 'react'

export function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null)
  const ringRef = useRef<HTMLDivElement>(null)
  const pos = useRef({ x: 0, y: 0 })
  const ringPos = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      pos.current = { x: e.clientX, y: e.clientY }
    }

    const onEnterLink = () => {
      ringRef.current?.classList.add('cursor-hover')
    }
    const onLeaveLink = () => {
      ringRef.current?.classList.remove('cursor-hover')
    }

    window.addEventListener('mousemove', onMove)

    const attachLinkListeners = () => {
      document.querySelectorAll('a, button, [role="button"], input, label').forEach(el => {
        el.addEventListener('mouseenter', onEnterLink)
        el.addEventListener('mouseleave', onLeaveLink)
      })
    }
    attachLinkListeners()

    let raf: number
    const animate = () => {
      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${pos.current.x - 3}px, ${pos.current.y - 3}px)`
      }
      if (ringRef.current) {
        ringPos.current.x += (pos.current.x - ringPos.current.x) * 0.12
        ringPos.current.y += (pos.current.y - ringPos.current.y) * 0.12
        ringRef.current.style.transform = `translate(${ringPos.current.x - 18}px, ${ringPos.current.y - 18}px)`
      }
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(raf)
    }
  }, [])

  return (
    <>
      <style>{`
        .cursor-dot {
          position: fixed; top: 0; left: 0;
          width: 6px; height: 6px;
          background: #fff;
          border-radius: 50%;
          pointer-events: none;
          z-index: 99999;
          will-change: transform;
        }
        .cursor-ring {
          position: fixed; top: 0; left: 0;
          width: 36px; height: 36px;
          border: 1px solid rgba(255,255,255,0.5);
          border-radius: 50%;
          pointer-events: none;
          z-index: 99998;
          will-change: transform;
          transition: width 0.2s, height 0.2s, border-color 0.2s;
        }
        .cursor-ring.cursor-hover {
          width: 56px; height: 56px;
          border-color: #39ff14;
          margin-left: -10px; margin-top: -10px;
        }
      `}</style>
      <div ref={dotRef} className="cursor-dot" />
      <div ref={ringRef} className="cursor-ring" />
    </>
  )
}
