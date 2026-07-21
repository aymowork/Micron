'use client'

import { useEffect, useState } from 'react'

interface TimeLeft {
  days: number; hours: number; minutes: number; seconds: number
}

function calc(target: Date): TimeLeft {
  const diff = target.getTime() - Date.now()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / 86400000),
    hours: Math.floor((diff % 86400000) / 3600000),
    minutes: Math.floor((diff % 3600000) / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
  }
}

function pad(n: number) { return String(n).padStart(2, '0') }

interface DropTimerProps {
  dropDate: string
  dropName: string
}

export function DropTimer({ dropDate, dropName }: DropTimerProps) {
  const target = new Date(dropDate)
  const [time, setTime] = useState<TimeLeft>(calc(target))
  const [isPast, setIsPast] = useState(false)

  useEffect(() => {
    const id = setInterval(() => {
      const t = calc(target)
      setTime(t)
      if (t.days === 0 && t.hours === 0 && t.minutes === 0 && t.seconds === 0) {
        setIsPast(true)
      }
    }, 1000)
    return () => clearInterval(id)
  }, [dropDate])

  if (isPast) return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '11px',
        letterSpacing: '0.3em',
        color: '#39ff14',
        marginBottom: '8px',
      }}>
        DROP LIVE
      </p>
      <p style={{
        fontFamily: 'Syne, sans-serif',
        fontWeight: 800,
        fontSize: '24px',
        letterSpacing: '0.1em',
      }}>
        {dropName.toUpperCase()}
      </p>
    </div>
  )

  return (
    <div style={{ textAlign: 'center' }}>
      <p style={{
        fontFamily: 'Space Mono, monospace',
        fontSize: '10px',
        letterSpacing: '0.3em',
        color: '#555',
        marginBottom: '24px',
      }}>
        PROCHAIN DROP — {dropName.toUpperCase()}
      </p>

      <div style={{ display: 'flex', gap: '32px', justifyContent: 'center', alignItems: 'flex-end' }}>
        {[
          { value: time.days, label: 'JOURS' },
          { value: time.hours, label: 'HRS' },
          { value: time.minutes, label: 'MIN' },
          { value: time.seconds, label: 'SEC' },
        ].map((unit, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontWeight: 700,
              fontSize: 'clamp(32px, 5vw, 64px)',
              letterSpacing: '-0.02em',
              color: '#fff',
              lineHeight: 1,
              minWidth: '2ch',
            }}>
              {pad(unit.value)}
            </div>
            <div style={{
              fontFamily: 'Space Mono, monospace',
              fontSize: '9px',
              letterSpacing: '0.2em',
              color: '#444',
              marginTop: '8px',
            }}>
              {unit.label}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
