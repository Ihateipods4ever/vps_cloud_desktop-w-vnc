import { NextRequest, NextResponse } from 'next/server'
import { writeFile, readFile, readdir, unlink, stat } from 'fs/promises'
import { mkdirSync } from 'fs'
import { join } from 'path'
import { existsSync } from 'fs'

const UPLOAD_DIR = join(process.cwd(), 'uploads')

// Ensure upload directory exists
if (!existsSync(UPLOAD_DIR)) {
  mkdirSync(UPLOAD_DIR, { recursive: true })
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path') || ''

    const targetPath = join(UPLOAD_DIR, path)
    
    if (!existsSync(targetPath)) {
      return NextResponse.json(
        { error: 'Path does not exist' },
        { status: 404 }
      )
    }

    const stats = await stat(targetPath)
    
    if (stats.isDirectory()) {
      const files = await readdir(targetPath)
      const fileList = await Promise.all(
        files.map(async (file) => {
          const filePath = join(targetPath, file)
          const fileStats = await stat(filePath)
          return {
            name: file,
            type: fileStats.isDirectory() ? 'folder' : 'file',
            size: fileStats.size,
            modified: fileStats.mtime.toISOString(),
            path: join(path, file)
          }
        })
      )
      return NextResponse.json(fileList)
    } else {
      // Return file content for single file
      const content = await readFile(targetPath)
      return new NextResponse(content, {
        headers: {
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': `attachment; filename="${path.split('/').pop()}"`
        }
      })
    }
  } catch (error) {
    console.error('File list error:', error)
    return NextResponse.json(
      { error: 'Failed to list files' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get('file') as File
    const path = formData.get('path') as string || ''

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)
    
    const fileName = file.name
    const filePath = join(UPLOAD_DIR, path, fileName)
    
    await writeFile(filePath, buffer)

    const fileStats = await stat(filePath)
    
    return NextResponse.json({
      success: true,
      file: {
        name: fileName,
        size: fileStats.size,
        modified: fileStats.mtime.toISOString(),
        path: join(path, fileName)
      }
    })
  } catch (error) {
    console.error('File upload error:', error)
    return NextResponse.json(
      { error: 'Failed to upload file' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const path = searchParams.get('path')

    if (!path) {
      return NextResponse.json(
        { error: 'File path is required' },
        { status: 400 }
      )
    }

    const targetPath = join(UPLOAD_DIR, path)
    
    if (!existsSync(targetPath)) {
      return NextResponse.json(
        { error: 'File does not exist' },
        { status: 404 }
      )
    }

    await unlink(targetPath)

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully',
      path: path
    })
  } catch (error) {
    console.error('File delete error:', error)
    return NextResponse.json(
      { error: 'Failed to delete file' },
      { status: 500 }
    )
  }
}