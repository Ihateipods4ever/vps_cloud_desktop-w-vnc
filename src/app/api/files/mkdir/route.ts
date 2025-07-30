import { NextRequest, NextResponse } from 'next/server'
import { mkdir } from 'fs/promises'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

export async function POST(request: NextRequest) {
  try {
    const { path, name } = await request.json()
    
    if (!name) {
      return NextResponse.json(
        { error: 'Directory name is required' },
        { status: 400 }
      )
    }

    const dirPath = join(UPLOAD_DIR, path || '', name)
    
    if (existsSync(dirPath)) {
      return NextResponse.json(
        { error: 'Directory already exists' },
        { status: 409 }
      )
    }

    await mkdir(dirPath, { recursive: true })

    return NextResponse.json({
      success: true,
      message: 'Directory created successfully',
      path: join(path || '', name)
    })
  } catch (error) {
    console.error('Directory creation error:', error)
    return NextResponse.json(
      { error: 'Failed to create directory' },
      { status: 500 }
    )
  }
}