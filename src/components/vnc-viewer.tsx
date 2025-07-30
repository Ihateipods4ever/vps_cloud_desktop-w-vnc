"use client"

import { useState, useEffect, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { 
  Monitor, 
  Settings, 
  RefreshCw, 
  Maximize2, 
  Minimize2, 
  Keyboard,
  Mouse,
  Wifi,
  WifiOff,
  AlertCircle
} from 'lucide-react'

interface VNCViewerProps {
  onDisconnect?: () => void
}

export default function VNCViewer({ onDisconnect }: VNCViewerProps) {
  const [isConnected, setIsConnected] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [connectionError, setConnectionError] = useState<string | null>(null)
  const [vncUrl, setVncUrl] = useState('')
  const [vncPassword, setVncPassword] = useState('')
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [showSettings, setShowSettings] = useState(false)
  const [connectionStats, setConnectionStats] = useState({
    latency: 0,
    bandwidth: 0,
    resolution: '1920x1080'
  })

  const canvasRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const defaultVncServers = [
    { name: 'Local VNC Server', url: 'ws://localhost:5901', description: 'Local VNC server on port 5901' },
    { name: 'Remote VNC Server', url: 'ws://192.168.1.100:5901', description: 'Remote VNC server' },
    { name: 'Cloud VNC', url: 'wss://vnc.example.com:5901', description: 'Secure cloud VNC connection' }
  ]

  const connectToVNC = async (url: string, password: string = '') => {
    setIsConnecting(true)
    setConnectionError(null)
    
    try {
      const response = await fetch('/api/vnc/connect', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to connect to VNC server')
      }

      setIsConnected(true)
      setConnectionStats({
        latency: data.estimatedLatency,
        bandwidth: data.bandwidth,
        resolution: data.resolution
      })
      
      // Start simulating screen updates
      simulateScreenUpdates()
    } catch (error) {
      setConnectionError(error instanceof Error ? error.message : 'Failed to connect to VNC server')
      setIsConnected(false)
    } finally {
      setIsConnecting(false)
    }
  }

  const disconnectFromVNC = async () => {
    try {
      if (isConnected) {
        await fetch('/api/vnc/disconnect', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ sessionId: 'current_session' }), // In real app, track session ID
        })
      }
    } catch (error) {
      console.error('Error disconnecting from VNC:', error)
    } finally {
      setIsConnected(false)
      setConnectionError(null)
      if (onDisconnect) {
        onDisconnect()
      }
    }
  }

  const simulateScreenUpdates = () => {
    if (!isConnected || !canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Simulate screen content
    ctx.fillStyle = '#1a1a1a'
    ctx.fillRect(0, 0, canvas.width, canvas.height)
    
    // Simulate desktop environment
    ctx.fillStyle = '#2d2d2d'
    ctx.fillRect(10, 10, canvas.width - 20, canvas.height - 20)
    
    // Simulate taskbar
    ctx.fillStyle = '#404040'
    ctx.fillRect(10, canvas.height - 50, canvas.width - 20, 40)
    
    // Simulate windows
    ctx.fillStyle = '#ffffff'
    ctx.fillRect(50, 50, 300, 200)
    ctx.fillRect(400, 100, 250, 150)
    
    // Simulate text
    ctx.fillStyle = '#000000'
    ctx.font = '14px Arial'
    ctx.fillText('Remote Desktop', 60, 80)
    ctx.fillText('File Manager', 410, 130)
    
    // Simulate cursor
    ctx.fillStyle = '#ff0000'
    ctx.fillRect(200, 150, 10, 10)
  }

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isConnected) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Simulate mouse click
    console.log(`Mouse click at (${x}, ${y})`)
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isConnected) return
    
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    // Simulate mouse movement
    console.log(`Mouse moved to (${x}, ${y})`)
  }

  const toggleFullscreen = () => {
    if (!containerRef.current) return
    
    if (!isFullscreen) {
      if (containerRef.current.requestFullscreen) {
        containerRef.current.requestFullscreen()
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
      }
    }
    setIsFullscreen(!isFullscreen)
  }

  const sendKey = (key: string) => {
    if (!isConnected) return
    console.log(`Sending key: ${key}`)
  }

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  useEffect(() => {
    if (isConnected) {
      const interval = setInterval(() => {
        if (isConnected) {
          simulateScreenUpdates()
        }
      }, 100)
      
      return () => clearInterval(interval)
    }
  }, [isConnected])

  return (
    <div className="h-full flex flex-col bg-gray-900">
      {/* VNC Header */}
      <div className="flex items-center justify-between p-3 bg-gray-800 border-b border-gray-700">
        <div className="flex items-center gap-3">
          <Monitor className="w-5 h-5 text-green-400" />
          <div>
            <h3 className="text-sm font-medium text-white">VNC Viewer</h3>
            <div className="flex items-center gap-2">
              {isConnected ? (
                <Badge variant="outline" className="text-green-400 border-green-400">
                  <Wifi className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : isConnecting ? (
                <Badge variant="outline" className="text-yellow-400 border-yellow-400">
                  <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
                  Connecting...
                </Badge>
              ) : (
                <Badge variant="outline" className="text-red-400 border-red-400">
                  <WifiOff className="w-3 h-3 mr-1" />
                  Disconnected
                </Badge>
              )}
              {isConnected && (
                <span className="text-xs text-gray-400">
                  {connectionStats.resolution} | {connectionStats.latency}ms | {connectionStats.bandwidth}Mbps
                </span>
              )}
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowSettings(!showSettings)}
            className="text-gray-300 hover:text-white"
          >
            <Settings className="w-4 h-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggleFullscreen}
            disabled={!isConnected}
            className="text-gray-300 hover:text-white"
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={disconnectFromVNC}
            className="text-red-400 hover:text-red-300"
          >
            <WifiOff className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* Settings Panel */}
      {showSettings && (
        <Card className="m-4 bg-gray-800 border-gray-700">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm text-white">VNC Connection Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-xs text-gray-300">VNC Server URL</label>
              <Input
                value={vncUrl}
                onChange={(e) => setVncUrl(e.target.value)}
                placeholder="ws://localhost:5901"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Password (optional)</label>
              <Input
                type="password"
                value={vncPassword}
                onChange={(e) => setVncPassword(e.target.value)}
                placeholder="Enter VNC password"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs text-gray-300">Quick Connect</label>
              <div className="space-y-1">
                {defaultVncServers.map((server, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      setVncUrl(server.url)
                      connectToVNC(server.url, vncPassword)
                    }}
                    className="w-full justify-start text-left bg-gray-700 border-gray-600 text-gray-300 hover:bg-gray-600"
                  >
                    <div>
                      <div className="font-medium">{server.name}</div>
                      <div className="text-xs text-gray-400">{server.description}</div>
                    </div>
                  </Button>
                ))}
              </div>
            </div>
            <Button
              onClick={() => connectToVNC(vncUrl, vncPassword)}
              disabled={!vncUrl || isConnecting}
              className="w-full"
            >
              {isConnecting ? (
                <>
                  <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                  Connecting...
                </>
              ) : (
                'Connect'
              )}
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Connection Error */}
      {connectionError && (
        <div className="mx-4 mt-4 p-3 bg-red-900/20 border border-red-700 rounded-lg">
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm text-red-400">{connectionError}</span>
          </div>
        </div>
      )}

      {/* VNC Canvas */}
      <div 
        ref={containerRef}
        className="flex-1 flex items-center justify-center bg-black relative overflow-hidden"
      >
        {!isConnected && !showSettings && (
          <div className="text-center space-y-4">
            <Monitor className="w-16 h-16 text-gray-600 mx-auto" />
            <div className="space-y-2">
              <h3 className="text-lg font-medium text-gray-300">No VNC Connection</h3>
              <p className="text-sm text-gray-500">Connect to a VNC server to start remote desktop</p>
              <Button onClick={() => setShowSettings(true)}>
                <Settings className="w-4 h-4 mr-2" />
                Configure Connection
              </Button>
            </div>
          </div>
        )}
        
        {isConnected && (
          <canvas
            ref={canvasRef}
            width={800}
            height={600}
            className="border border-gray-700 cursor-pointer"
            onClick={handleCanvasClick}
            onMouseMove={handleCanvasMouseMove}
          />
        )}
      </div>

      {/* VNC Controls */}
      {isConnected && (
        <div className="p-3 bg-gray-800 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendKey('Ctrl+Alt+Del')}
                className="text-gray-300 hover:text-white"
              >
                <span className="text-xs">Ctrl+Alt+Del</span>
              </Button>
              <div className="w-px h-6 bg-gray-600" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => sendKey('Ctrl+C')}
                className="text-gray-300 hover:text-white"
              >
                <Keyboard className="w-4 h-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-gray-300 hover:text-white"
              >
                <Mouse className="w-4 h-4" />
              </Button>
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-400">
                Quality: High | Compression: None
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}