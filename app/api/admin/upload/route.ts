import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'

function isAuth(req: NextRequest) {
  const session = req.cookies.get('micron_admin_session')
  return session?.value === process.env.ADMIN_SESSION_SECRET
}

export async function POST(req: NextRequest) {
  try {
    if (!isAuth(req)) return NextResponse.json({ error: 'Non connecté' }, { status: 401 })

    const formData = await req.formData()
    const file = formData.get('file') as File | null
    if (!file) return NextResponse.json({ error: 'Aucun fichier reçu' }, { status: 400 })

    const ext = file.name.split('.').pop()?.toLowerCase() || 'jpg'
    const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
    const uploadDir = path.join(process.cwd(), 'public', 'uploads')

    await mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(path.join(uploadDir, fileName), buffer)

    return NextResponse.json({ url: `/uploads/${fileName}` })
  } catch (err: any) {
    console.error('Upload error:', err)
    return NextResponse.json({ error: err?.message || 'Erreur inconnue' }, { status: 500 })
  }
}
