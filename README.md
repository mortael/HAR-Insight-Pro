<div align="center">
<img width="512" height="512" alt="HAR Insight Pro Logo" src="build/icon.svg" />
</div>

# HAR Insight Pro - Desktop Application

A high-performance, developer-focused HAR file editor with advanced filtering, sanitization, and code conversion tools. Now available as a Windows desktop application!

## Features

- 🔍 **Advanced Filtering**: Powerful search and filter capabilities for HAR entries
- 🛡️ **Sanitization**: Remove sensitive data from HAR files
- 📊 **Detailed Analysis**: View request/response details, headers, and timings
- 🎨 **Modern UI**: Clean, responsive interface with dark mode
- 💻 **Desktop App**: Native Windows application built with Electron

## Download & Installation

### For Windows Users

1. Download the latest installer from the [Releases](https://github.com/mortael/HAR-Insight-Pro/releases) page:
   - **Installer**: `HAR-Insight-Pro-1.0.0-x64.exe` (recommended)
   - **Portable**: `HAR-Insight-Pro-1.0.0-portable.exe` (no installation required)

2. Run the installer and follow the setup wizard
3. Launch HAR Insight Pro from your Start Menu or Desktop shortcut

## Development

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Run as Web Application

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

The app will be available at http://localhost:3000

### Run as Desktop Application (Development)

```bash
# Install dependencies
npm install

# Start Electron in development mode
npm run electron:dev
```

This will start both the Vite dev server and Electron, with hot-reload enabled.

### Build Desktop Application

```bash
# Build for Windows
npm run electron:build:win

# Or build for all configured platforms
npm run electron:build
```

The built application will be in the `release/` directory.

## Project Structure

```
HAR-Insight-Pro/
├── electron/           # Electron main process files
│   ├── main.js        # Electron main process
│   └── preload.js     # Preload script for security
├── src/               # React application source
│   ├── components/    # React components
│   ├── lib/          # Utility functions
│   ├── App.tsx       # Main application component
│   └── main.tsx      # React entry point
├── build/            # Application icons and assets
├── scripts/          # Build and utility scripts
└── dist/            # Build output (generated)
```

## How to Use

1. **Upload a HAR File**: Drag and drop or click to select a HAR file
2. **Filter Entries**: Use the search bar with advanced filters:
   - `method:GET` - Filter by HTTP method
   - `status:200` - Filter by status code
   - `type:json` - Filter by content type
   - `size>1000` - Filter by response size
3. **Sanitize Data**: Click "Sanitize Entries" to remove sensitive headers
4. **Export**: Download the modified HAR file

## Building from Source

### Icon Generation

Icons are automatically generated during `npm install` from the SVG source. To regenerate manually:

```bash
node scripts/generate-icons.cjs
```

### Packaging

The application uses `electron-builder` for packaging. Configuration is in `electron-builder.json`.

## Tech Stack

- **Frontend**: React 19 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Desktop**: Electron
- **Icons**: Lucide React
- **Animations**: Motion

## License

This project is licensed under the MIT License.

## Support

For issues, questions, or contributions, please visit our [GitHub repository](https://github.com/mortael/HAR-Insight-Pro).
