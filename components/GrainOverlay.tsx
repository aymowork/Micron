'use client'

export function GrainOverlay() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        pointerEvents: 'none',
        zIndex: 9990,
        background: 'transparent',
      }}
    />
  )
}
