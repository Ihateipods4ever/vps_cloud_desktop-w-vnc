"use client"

import { useState, useRef, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Monitor, 
  Folder, 
  Terminal, 
  Settings, 
  Cloud, 
  HardDrive,
  Wifi,
  Battery,
  Clock,
  User,
  Search,
  Power,
  Maximize2,
  Minimize2,
  X,
  Plus,
  Upload,
  Download,
  Trash2,
  File,
  FolderOpen,
  MonitorDot
} from 'lucide-react'
import VNCViewer from '@/components/vnc-viewer'

interface DesktopIcon {
  id: string
  name: string
  icon: React.ReactNode
  onClick: () => void
}

interface Window {
  id: string
  title: string
  content: React.ReactNode
  minimized: boolean
  maximized: boolean
  x: number
  y: number
  width: number
  height: number
}

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size: string
  modified: string
  path: string
}

export default function Home() {
  const [windows, setWindows] = useState<Window[]>([])
  const [activeWindow, setActiveWindow] = useState<string | null>(null)
  const [terminalOutput, setTerminalOutput] = useState<string[]>([])
  const [terminalInput, setTerminalInput] = useState('')
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'Documents', type: 'folder', size: '2.4 GB', modified: '2024-01-15', path: 'Documents' },
    { id: '2', name: 'Downloads', type: 'folder', size: '1.8 GB', modified: '2024-01-14', path: 'Downloads' },
    { id: '3', name: 'Pictures', type: 'folder', size: '3.2 GB', modified: '2024-01-13', path: 'Pictures' },
    { id: '4', name: 'report.pdf', type: 'file', size: '2.4 MB', modified: '2024-01-15', path: 'report.pdf' },
    { id: '5', name: 'presentation.pptx', type: 'file', size: '5.7 MB', modified: '2024-01-14', path: 'presentation.pptx' },
    { id: '6', name: 'archive.zip', type: 'file', size: '15.3 MB', modified: '2024-01-12', path: 'archive.zip' },
  ])
  const [systemStats, setSystemStats] = useState({
    cpu: 25,
    memory: 60,
    storage: 45,
    network: 12
  })
  const [time, setTime] = useState(new Date())

  const terminalRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [terminalOutput])

  const desktopIcons: DesktopIcon[] = [
    {
      id: 'file-explorer',
      name: 'File Explorer',
      icon: <Folder className="w-8 h-8" />,
      onClick: () => openWindow('file-explorer', 'File Explorer', <FileExplorer />)
    },
    {
      id: 'vnc-viewer',
      name: 'VNC Viewer',
      icon: <MonitorDot className="w-8 h-8" />,
      onClick: () => openWindow('vnc-viewer', 'VNC Viewer', <VNCViewer />)
    },
    {
      id: 'terminal',
      name: 'Terminal',
      icon: <Terminal className="w-8 h-8" />,
      onClick: () => openWindow('terminal', 'Terminal', <TerminalWindow />)
    },
    {
      id: 'system-monitor',
      name: 'System Monitor',
      icon: <Monitor className="w-8 h-8" />,
      onClick: () => openWindow('system-monitor', 'System Monitor', <SystemMonitor />)
    },
    {
      id: 'cloud-storage',
      name: 'Cloud Storage',
      icon: <Cloud className="w-8 h-8" />,
      onClick: () => openWindow('cloud-storage', 'Cloud Storage', <CloudStorage />)
    },
    {
      id: 'settings',
      name: 'Settings',
      icon: <Settings className="w-8 h-8" />,
      onClick: () => openWindow('settings', 'Settings', <SettingsPanel />)
    }
  ]

  const openWindow = (id: string, title: string, content: React.ReactNode) => {
    const existingWindow = windows.find(w => w.id === id)
    if (existingWindow) {
      setWindows(windows.map(w => 
        w.id === id ? { ...w, minimized: false } : w
      ))
      setActiveWindow(id)
      return
    }

    const newWindow: Window = {
      id,
      title,
      content,
      minimized: false,
      maximized: false,
      x: 100 + windows.length * 30,
      y: 100 + windows.length * 30,
      width: 600,
      height: 400
    }

    setWindows([...windows, newWindow])
    setActiveWindow(id)
  }

  const closeWindow = (id: string) => {
    setWindows(windows.filter(w => w.id !== id))
    if (activeWindow === id) {
      setActiveWindow(windows.length > 1 ? windows[0].id : null)
    }
  }

  const minimizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, minimized: true } : w
    ))
    if (activeWindow === id) {
      setActiveWindow(windows.find(w => w.id !== id && !w.minimized)?.id || null)
    }
  }

  const maximizeWindow = (id: string) => {
    setWindows(windows.map(w => 
      w.id === id ? { ...w, maximized: !w.maximized } : w
    ))
  }

  const handleTerminalCommand = (command: string) => {
    setTerminalOutput([...terminalOutput, `$ ${command}`])
    
    if (command.trim() === 'clear') {
      setTerminalOutput([])
      return
    }

    if (command.trim() === 'help') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, 
        'Available commands:',
        '  help     - Show this help message',
        '  clear    - Clear terminal',
        '  ls       - List files',
        '  pwd      - Show current directory',
        '  ps       - Show running processes',
        '  df       - Show disk usage',
        '  status   - Show system status'
      ])
      return
    }

    if (command.trim() === 'ls') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, 
        'Documents/  Downloads/  Pictures/  report.pdf  presentation.pptx  archive.zip'
      ])
      return
    }

    if (command.trim() === 'pwd') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, '/home/user'])
      return
    }

    if (command.trim() === 'ps') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, 
        'PID  COMMAND',
        '1234 /usr/bin/node',
        '1235 /usr/bin/nginx',
        '1236 /usr/bin/mongodb'
      ])
      return
    }

    if (command.trim() === 'df') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, 
        'Filesystem     Size  Used  Avail  Use%',
        '/dev/sda1      500G  225G  275G   45%'
      ])
      return
    }

    if (command.trim() === 'status') {
      setTerminalOutput([...terminalOutput, `$ ${command}`, 
        `CPU: ${systemStats.cpu}%`,
        `Memory: ${systemStats.memory}%`,
        `Storage: ${systemStats.storage}%`,
        `Network: ${systemStats.network}%`
      ])
      return
    }

    setTerminalOutput([...terminalOutput, `$ ${command}`, `Command not found: ${command}`])
  }

  const FileExplorer = () => {
    const [currentPath, setCurrentPath] = useState('')
    const [selectedFile, setSelectedFile] = useState<string | null>(null)
    const fileInputRef = useRef<HTMLInputElement>(null)

    const loadFiles = async (path: string = '') => {
      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`)
        if (response.ok) {
          const fileList = await response.json()
          setFiles(fileList.map((file: any, index: number) => ({
            id: file.path || index.toString(),
            name: file.name,
            type: file.type,
            size: formatFileSize(file.size),
            modified: new Date(file.modified).toLocaleDateString(),
            path: file.path
          })))
          setCurrentPath(path)
        }
      } catch (error) {
        console.error('Error loading files:', error)
      }
    }

    const formatFileSize = (bytes: number): string => {
      if (bytes === 0) return '0 Bytes'
      const k = 1024
      const sizes = ['Bytes', 'KB', 'MB', 'GB']
      const i = Math.floor(Math.log(bytes) / Math.log(k))
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
    }

    const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0]
      if (!file) return

      const formData = new FormData()
      formData.append('file', file)
      formData.append('path', currentPath)

      try {
        const response = await fetch('/api/files', {
          method: 'POST',
          body: formData,
        })

        if (response.ok) {
          await loadFiles(currentPath)
        }
      } catch (error) {
        console.error('Error uploading file:', error)
      }

      if (fileInputRef.current) {
        fileInputRef.current.value = ''
      }
    }

    const handleCreateFolder = async () => {
      const folderName = prompt('Enter folder name:')
      if (!folderName) return

      try {
        const response = await fetch('/api/files/mkdir', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ path: currentPath, name: folderName }),
        })

        if (response.ok) {
          await loadFiles(currentPath)
        }
      } catch (error) {
        console.error('Error creating folder:', error)
      }
    }

    const handleDeleteFile = async (path: string) => {
      if (!confirm('Are you sure you want to delete this item?')) return

      try {
        const response = await fetch(`/api/files?path=${encodeURIComponent(path)}`, {
          method: 'DELETE',
        })

        if (response.ok) {
          await loadFiles(currentPath)
        }
      } catch (error) {
        console.error('Error deleting file:', error)
      }
    }

    const handleFileClick = (file: FileItem) => {
      if (file.type === 'folder') {
        loadFiles(file.path)
      } else {
        // Handle file download/open
        window.open(`/api/files?path=${encodeURIComponent(file.path)}`, '_blank')
      }
    }

    const navigateUp = () => {
      if (currentPath) {
        const parentPath = currentPath.split('/').slice(0, -1).join('/')
        loadFiles(parentPath)
      }
    }

    useEffect(() => {
      loadFiles()
    }, [])

    return (
      <div className="h-full flex flex-col">
        <div className="p-4 border-b">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" onClick={navigateUp} disabled={!currentPath}>
              ↑ Up
            </Button>
            <Button variant="outline" size="sm" onClick={handleCreateFolder}>
              <Plus className="w-4 h-4 mr-2" />
              New Folder
            </Button>
            <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
              <Upload className="w-4 h-4 mr-2" />
              Upload
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              onChange={handleFileUpload}
              className="hidden"
            />
            <div className="flex-1" />
            <Input placeholder="Search files..." className="w-64" />
          </div>
          <div className="mt-2 text-sm text-gray-500">
            Path: {currentPath || '/'}
          </div>
        </div>
        <div className="flex-1 p-4">
          <div className="grid grid-cols-6 gap-4">
            {files.map((file) => (
              <div
                key={file.id}
                className="flex flex-col items-center p-2 rounded hover:bg-gray-100 cursor-pointer relative group"
                onClick={() => handleFileClick(file)}
              >
                {file.type === 'folder' ? (
                  <FolderOpen className="w-12 h-12 text-blue-500 mb-2" />
                ) : (
                  <File className="w-12 h-12 text-gray-500 mb-2" />
                )}
                <span className="text-xs text-center">{file.name}</span>
                <button
                  className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 p-1 hover:bg-red-100 rounded"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDeleteFile(file.path)
                  }}
                >
                  <Trash2 className="w-3 h-3 text-red-500" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    )
  }

  const TerminalWindow = () => (
    <div className="h-full flex flex-col bg-black text-green-400 font-mono">
      <div 
        ref={terminalRef}
        className="flex-1 p-4 overflow-y-auto"
      >
        {terminalOutput.map((line, index) => (
          <div key={index}>{line}</div>
        ))}
      </div>
      <div className="p-2 border-t border-gray-700 flex items-center">
        <span className="mr-2">$</span>
        <Input
          value={terminalInput}
          onChange={(e) => setTerminalInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              handleTerminalCommand(terminalInput)
              setTerminalInput('')
            }
          }}
          className="bg-transparent border-none text-green-400 focus:ring-0"
          placeholder="Type command..."
        />
      </div>
    </div>
  )

  const SystemMonitor = () => (
    <div className="h-full p-4">
      <div className="grid grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">CPU Usage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemStats.cpu} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">{systemStats.cpu}% used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Memory</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemStats.memory} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">{systemStats.memory}% used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Storage</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemStats.storage} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">{systemStats.storage}% used</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm">Network</CardTitle>
          </CardHeader>
          <CardContent>
            <Progress value={systemStats.network} className="w-full" />
            <p className="text-xs text-muted-foreground mt-2">{systemStats.network}% active</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )

  const CloudStorage = () => (
    <div className="h-full p-4">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Cloud Storage</h3>
          <Badge variant="outline">Connected</Badge>
        </div>
        <Card>
          <CardContent className="p-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm">Total Storage</span>
                <span className="text-sm font-medium">100 GB</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm">Used</span>
                <span className="text-sm font-medium">45 GB</span>
              </div>
              <Progress value={45} className="w-full" />
            </div>
          </CardContent>
        </Card>
        <div className="space-y-2">
          <h4 className="font-medium">Quick Actions</h4>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" size="sm">
              <Upload className="w-4 h-4 mr-2" />
              Upload Files
            </Button>
            <Button variant="outline" size="sm">
              <Download className="w-4 h-4 mr-2" />
              Download Files
            </Button>
          </div>
        </div>
      </div>
    </div>
  )

  const SettingsPanel = () => (
    <div className="h-full p-4">
      <Tabs defaultValue="general" className="h-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="network">Network</TabsTrigger>
        </TabsList>
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>System Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Server Name</label>
                <Input defaultValue="my-vps-server" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Timezone</label>
                <Input defaultValue="UTC" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="storage">
          <Card>
            <CardHeader>
              <CardTitle>Storage Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-backup</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Storage Quota</span>
                  <Button variant="outline" size="sm">Manage</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="network">
          <Card>
            <CardHeader>
              <CardTitle>Network Settings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Firewall</span>
                  <Badge variant="outline">Active</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span>Port Forwarding</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )

  return (
    <div className="h-screen bg-gradient-to-br from-blue-50 to-indigo-100 overflow-hidden">
      {/* Desktop Icons */}
      <div className="absolute inset-0 p-8">
        <div className="grid grid-cols-8 gap-8">
          {desktopIcons.map((icon) => (
            <div
              key={icon.id}
              className="flex flex-col items-center p-4 rounded-lg hover:bg-white/20 cursor-pointer transition-colors"
              onClick={icon.onClick}
            >
              <div className="text-blue-600 mb-2">{icon.icon}</div>
              <span className="text-xs text-center font-medium text-gray-700">{icon.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Windows */}
      {windows.map((window) => (
        !window.minimized && (
          <div
            key={window.id}
            className={`absolute bg-white rounded-lg shadow-lg border ${activeWindow === window.id ? 'ring-2 ring-blue-500' : ''}`}
            style={{
              left: window.x,
              top: window.y,
              width: window.maximized ? '100%' : window.width,
              height: window.maximized ? '100%' : window.height,
              zIndex: activeWindow === window.id ? 10 : 1
            }}
            onClick={() => setActiveWindow(window.id)}
          >
            <div className="flex items-center justify-between p-2 bg-gray-100 border-b rounded-t-lg">
              <span className="text-sm font-medium">{window.title}</span>
              <div className="flex items-center gap-1">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => minimizeWindow(window.id)}
                >
                  <Minimize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => maximizeWindow(window.id)}
                >
                  <Maximize2 className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => closeWindow(window.id)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <div className="h-[calc(100%-40px)]">
              {window.content}
            </div>
          </div>
        )
      ))}

      {/* Taskbar */}
      <div className="absolute bottom-0 left-0 right-0 h-12 bg-gray-900 text-white flex items-center px-4">
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Monitor className="w-5 h-5" />
          </Button>
          <div className="w-px h-6 bg-gray-600" />
          {windows.map((window) => (
            <Button
              key={window.id}
              variant={activeWindow === window.id ? "secondary" : "ghost"}
              size="sm"
              className={`text-xs ${activeWindow === window.id ? 'bg-gray-700' : 'text-gray-300 hover:bg-gray-800'}`}
              onClick={() => {
                if (window.minimized) {
                  setWindows(windows.map(w => 
                    w.id === window.id ? { ...w, minimized: false } : w
                  ))
                }
                setActiveWindow(window.id)
              }}
            >
              {window.title}
            </Button>
          ))}
        </div>
        <div className="flex-1" />
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Wifi className="w-4 h-4" />
            <span>Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <HardDrive className="w-4 h-4" />
            <span>{systemStats.storage}%</span>
          </div>
          <div className="flex items-center gap-2">
            <Battery className="w-4 h-4" />
            <span>100%</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span>{time.toLocaleTimeString()}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4" />
            <span>User</span>
          </div>
          <Button variant="ghost" size="sm" className="text-white hover:bg-gray-800">
            <Power className="w-5 h-5" />
          </Button>
        </div>
      </div>
    </div>
  )
}