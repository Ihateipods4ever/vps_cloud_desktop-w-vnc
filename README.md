# VPS Desktop - Cloud Desktop & VNC Viewer

A comprehensive web-based VPS desktop application that turns your desktop into an online VPS with cloud storage capabilities. Built with Next.js 15, TypeScript, and modern web technologies.

## Features

### 🖥️ Desktop Environment
- **Desktop Interface**: Full desktop-like environment with windows, taskbar, and system tray
- **Window Management**: Minimize, maximize, and close windows with intuitive controls
- **Desktop Icons**: Quick access to applications and tools

### 📁 File Management
- **File Explorer**: Browse, upload, download, and manage files
- **Cloud Storage**: Integrated cloud storage with quota management
- **Drag & Drop**: Easy file operations with visual feedback
- **Directory Navigation**: Navigate through folders with breadcrumb navigation

### 🔧 VNC Viewer
- **Remote Desktop**: Connect to VNC servers for remote desktop access
- **Multiple Connections**: Support for multiple VNC server configurations
- **Real-time Display**: Live desktop streaming with mouse and keyboard input
- **Connection Management**: Easy connect/disconnect with session tracking

### 💻 Terminal
- **Command Line**: Full terminal emulator with command history
- **System Commands**: Execute system commands and view output
- **Multiple Commands**: Support for various system operations (ls, ps, df, etc.)

### 📊 System Monitoring
- **Real-time Stats**: Monitor CPU, memory, storage, and network usage
- **Visual Indicators**: Progress bars and charts for system metrics
- **Performance Tracking**: Track system performance over time

### ⚙️ Settings
- **System Configuration**: Configure server settings and preferences
- **Storage Management**: Manage storage quotas and backup settings
- **Network Configuration**: Configure firewall and port forwarding

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd vps-desktop
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the application**
   ```bash
   npm run dev
   ```

4. **Access the application**
   Open your browser and navigate to `http://localhost:3000`

### Using the Deployment Script

For easy deployment, use the provided deployment script:

```bash
./deploy.sh
```

This script will:
- Check for Node.js and npm
- Install dependencies
- Build the application
- Start the development server

## Usage Guide

### Desktop Interface

1. **Desktop Icons**: Click on any desktop icon to open the corresponding application
2. **Window Management**: Use the window controls (minimize, maximize, close) in the top-right corner of each window
3. **Taskbar**: Access running applications from the taskbar at the bottom of the screen
4. **System Tray**: View system status and access quick settings

### File Management

1. **Open File Explorer**: Click the "File Explorer" desktop icon
2. **Navigate Folders**: Click on folders to navigate, use the "Up" button to go back
3. **Upload Files**: Click the "Upload" button and select files to upload
4. **Create Folders**: Click "New Folder" and enter a folder name
5. **Delete Files**: Hover over files/folders and click the delete button
6. **Download Files**: Click on files to download them

### VNC Viewer

1. **Open VNC Viewer**: Click the "VNC Viewer" desktop icon
2. **Configure Connection**: 
   - Enter VNC server URL (e.g., `ws://localhost:5901`)
   - Enter password if required
   - Use quick connect buttons for pre-configured servers
3. **Connect**: Click "Connect" to establish the VNC connection
4. **Remote Control**: Use mouse and keyboard to control the remote desktop
5. **Disconnect**: Click the disconnect button to end the session

### Terminal

1. **Open Terminal**: Click the "Terminal" desktop icon
2. **Enter Commands**: Type commands and press Enter to execute
3. **Available Commands**:
   - `help` - Show available commands
   - `clear` - Clear terminal
   - `ls` - List files
   - `pwd` - Show current directory
   - `ps` - Show running processes
   - `df` - Show disk usage
   - `status` - Show system status

### System Monitor

1. **Open System Monitor**: Click the "System Monitor" desktop icon
2. **View Metrics**: Monitor CPU, memory, storage, and network usage
3. **Real-time Updates**: Stats update in real-time

## API Endpoints

### VNC Operations
- `POST /api/vnc/connect` - Connect to VNC server
- `POST /api/vnc/disconnect` - Disconnect from VNC server

### File Operations
- `GET /api/files` - List files or download file
- `POST /api/files` - Upload file
- `DELETE /api/files` - Delete file
- `POST /api/files/mkdir` - Create directory

### Health Check
- `GET /api/health` - Application health status

## Configuration

### Environment Variables
Create a `.env.local` file for environment-specific configuration:

```env
# Application Settings
NEXT_PUBLIC_APP_NAME="VPS Desktop"
NEXT_PUBLIC_APP_VERSION="1.0.0"

# VNC Settings
NEXT_PUBLIC_DEFAULT_VNC_PORT=5901
NEXT_PUBLIC_VNC_TIMEOUT=30000

# File Storage
UPLOAD_DIR="./uploads"
MAX_FILE_SIZE=104857600  # 100MB

# Security
NEXTAUTH_SECRET=your-secret-key
NEXTAUTH_URL=http://localhost:3000
```

### Default VNC Servers
The application comes with pre-configured VNC servers:
- Local VNC Server: `ws://localhost:5901`
- Remote VNC Server: `ws://192.168.1.100:5901`
- Cloud VNC: `wss://vnc.example.com:5901`

## Security Considerations

1. **VNC Connections**: Always use secure WebSocket connections (wss://) for remote VNC access
2. **File Uploads**: Validate file types and sizes to prevent malicious uploads
3. **Authentication**: Implement user authentication for production deployment
4. **Firewall**: Configure firewall rules to restrict access to necessary ports only

## Troubleshooting

### Common Issues

1. **VNC Connection Failed**
   - Check VNC server URL format (must start with ws:// or wss://)
   - Ensure VNC server is running and accessible
   - Verify firewall settings

2. **File Upload Issues**
   - Check file size limits
   - Ensure upload directory has proper permissions
   - Verify file format restrictions

3. **Application Won't Start**
   - Ensure Node.js 18+ is installed
   - Check for port conflicts (default: 3000)
   - Verify all dependencies are installed

### Logs

Check the development server logs at `/home/z/my-project/dev.log` for detailed error information.

## Development

### Project Structure
```
src/
├── app/
│   ├── api/          # API routes
│   ├── page.tsx      # Main desktop interface
│   └── layout.tsx    # App layout
├── components/
│   ├── ui/           # UI components
│   └── vnc-viewer.tsx # VNC viewer component
└── hooks/            # Custom React hooks
```

### Building for Production

```bash
npm run build
npm start
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For issues and questions:
- Check the troubleshooting section
- Review the development logs
- Create an issue in the repository

---

**Note**: This application is designed for development and testing purposes. For production deployment, ensure proper security measures are in place, including authentication, encryption, and access controls.