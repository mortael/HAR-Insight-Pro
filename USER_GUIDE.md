# HAR Insight Pro - User Guide

## What is HAR Insight Pro?

HAR Insight Pro is a powerful desktop application for analyzing, editing, and sanitizing HTTP Archive (HAR) files. HAR files are JSON-formatted archives of HTTP transactions that browsers can export, useful for debugging web applications, analyzing network performance, and security testing.

## Installation

### Windows

1. Download the installer from the [Releases](https://github.com/mortael/HAR-Insight-Pro/releases) page
2. Choose your preferred version:
   - **Installer** (`HAR-Insight-Pro-1.0.0-x64.exe`): Installs to your system with shortcuts
   - **Portable** (`HAR-Insight-Pro-1.0.0-portable.exe`): No installation required, runs from anywhere
3. Run the downloaded file
4. For the installer, follow the setup wizard
5. Launch HAR Insight Pro from the Start Menu or Desktop shortcut

### System Requirements

- **Operating System**: Windows 7 or later (64-bit)
- **Processor**: Any modern 64-bit CPU
- **RAM**: 512 MB minimum (2 GB recommended)
- **Disk Space**: 150 MB

## Getting Started

### Obtaining HAR Files

Before using HAR Insight Pro, you need a HAR file. Here's how to export one from popular browsers:

#### Google Chrome / Microsoft Edge
1. Open Developer Tools (F12)
2. Go to the **Network** tab
3. Reload the page or perform the actions you want to capture
4. Right-click in the network log
5. Select **Save all as HAR with content**

#### Firefox
1. Open Developer Tools (F12)
2. Go to the **Network** tab
3. Reload the page or perform actions
4. Click the gear icon (⚙️)
5. Select **Save All As HAR**

#### Safari
1. Enable Developer menu: Preferences → Advanced → Show Develop menu
2. Open Web Inspector (Option + Command + I)
3. Go to the **Network** tab
4. Reload or perform actions
5. Click Export (arrow icon)

### Loading HAR Files

1. Launch HAR Insight Pro
2. On the welcome screen, either:
   - **Drag and drop** a HAR file into the window, or
   - **Click** the upload area to browse for a file
3. The application will parse and display all HTTP requests

## Main Features

### 1. Request Table

The main view shows all HTTP requests in a sortable table with columns:

- **#**: Request sequence number
- **Status**: HTTP status code (200, 404, etc.)
- **Method**: HTTP method (GET, POST, etc.)
- **Domain**: The hostname of the request
- **File / Path**: The requested resource path
- **Type**: Content type (JSON, HTML, image, etc.)
- **Size**: Response size in bytes/KB
- **Time**: Request duration in milliseconds

**Actions:**
- Click any column header to sort
- Click a row to view detailed information
- Right-click a row to delete individual entries

### 2. Search and Filtering

Use the search bar to filter requests with powerful query syntax:

#### Simple Search
Type any text to search across URLs, methods, and types:
```
google
```

#### Advanced Filters

**Filter by Method:**
```
method:GET
method:POST
```

**Filter by Status Code:**
```
status:200
status:404
```

**Filter by Content Type:**
```
type:json
type:image
type:javascript
```

**Filter by Size:**
```
size>1000        # Larger than 1000 bytes
size<500         # Smaller than 500 bytes
size>=1024       # 1 KB or larger
```

**Filter by URL:**
```
url:api
url:example.com
```

**Combine Filters:**
```
method:POST status:200 type:json
```

### 3. Quick Filters (Toolbar)

Click the filter buttons for common filters:
- **All**: Show all requests
- **XHR**: AJAX/API requests (JSON/XML)
- **JS**: JavaScript files
- **CSS**: Stylesheets
- **Img**: Images
- **Media**: Video/Audio
- **Font**: Font files
- **Doc**: HTML documents
- **GET/POST/etc.**: Filter by HTTP method

### 4. Request Details Panel

Click any request to open the details panel showing:

#### General Information
- Request URL
- HTTP method
- Status code and text
- Content type
- File size
- Timing information

#### Request Headers
All HTTP headers sent with the request

#### Response Headers
All HTTP headers received in the response

#### Request Body
POST/PUT request payload (if applicable)

#### Response Body
Response content with syntax highlighting for:
- JSON
- HTML
- XML
- Plain text

### 5. Sanitization

Remove sensitive information before sharing HAR files:

1. Click **"Sanitize Entries"** button in the header
2. Configure what to remove:
   - **Headers to Remove**: e.g., `Authorization`, `Cookie`, `Set-Cookie`
   - **Patterns to Redact**: Regular expressions to find and mask sensitive data
3. Click **"Apply Sanitization"**
4. Sensitive data will be replaced with `[REDACTED]`

**Common headers to sanitize:**
- `Authorization`
- `Cookie`
- `Set-Cookie`
- `X-API-Key`
- `X-Auth-Token`

### 6. Purge Large Assets

Remove media files to reduce HAR file size:

1. Click **"Purge Large Assets"** in the header
2. All image, video, and audio requests will be removed
3. This helps focus on API and document requests

### 7. Column Customization

Customize which columns are visible:

1. Click the column settings icon in the toolbar
2. Toggle columns on/off
3. Reorder columns with up/down arrows
4. Click "Reset Columns" to restore defaults

Your column preferences are saved automatically.

### 8. Export Modified HAR

After making changes, export the modified HAR file:

1. Click **"Export HAR"** button in the header
2. Choose where to save the file
3. The exported file can be:
   - Re-imported into HAR Insight Pro
   - Imported into browser DevTools
   - Shared with team members

## Tips and Tricks

### Performance Analysis

1. Sort by **Time** to find slow requests
2. Sort by **Size** to find large resources
3. Use `size>100000` to find requests over 100 KB
4. Filter by `status:404` to find missing resources

### API Debugging

1. Filter by `type:json` to see only API calls
2. Use method filters (`method:POST`) for specific operations
3. Check request/response bodies in the details panel
4. Look for status codes in the 400-500 range for errors

### Security Auditing

1. Search for `user:` to find authentication-related headers
2. Look for sensitive data in request/response bodies
3. Use sanitization before sharing HAR files externally
4. Check for unencrypted (HTTP) requests

### Working with Large Files

1. Use filters to focus on specific requests
2. Purge large assets to reduce clutter
3. Delete individual unnecessary entries
4. Export filtered results as a new HAR file

## Keyboard Shortcuts

- **Ctrl + F**: Focus search bar
- **Escape**: Clear search / Close details panel
- **Ctrl + O**: Open HAR file (when implemented)
- **Delete**: Remove selected entry

## Data Privacy

HAR Insight Pro processes files **locally on your computer**. No data is sent to external servers. All operations are performed client-side, ensuring your data remains private and secure.

## Troubleshooting

### HAR file won't load

**Problem**: Error message when loading a HAR file

**Solutions:**
1. Ensure the file is a valid HAR file (exported from browser DevTools)
2. Check that the file isn't corrupted (try opening in a text editor)
3. Try exporting a fresh HAR file from your browser
4. Ensure the file extension is `.har`

### Application is slow with large files

**Problem**: Performance issues with HAR files containing thousands of requests

**Solutions:**
1. Use filters to reduce visible entries
2. Purge large assets
3. Delete unnecessary entries
4. Export a filtered version for better performance

### Can't find specific requests

**Problem**: Known requests aren't showing up

**Solutions:**
1. Clear all active filters
2. Check the search bar for active queries
3. Use the "All" quick filter
4. Verify the request is in the original HAR file

### Exported file doesn't work in browser

**Problem**: Exported HAR won't import into Chrome DevTools

**Solutions:**
1. Ensure you're exporting with valid JSON
2. Check that required HAR fields weren't removed during sanitization
3. Try re-exporting without sanitization

## Frequently Asked Questions

### Q: Is my data safe?
**A:** Yes! HAR Insight Pro runs entirely on your computer. No data is uploaded or shared.

### Q: Can I edit request/response data?
**A:** Currently, you can delete entries and sanitize sensitive data. Direct editing of request/response content is planned for future versions.

### Q: What formats are supported?
**A:** HAR Insight Pro supports standard HAR 1.2 format files exported from all major browsers.

### Q: Can I use this for automated testing?
**A:** The desktop app is designed for manual analysis. For automation, consider using the web version or HAR parsing libraries.

### Q: How do I update the application?
**A:** Check the GitHub releases page for new versions. Download and install the latest version (your settings will be preserved).

## Getting Help

- **GitHub Issues**: [Report bugs or request features](https://github.com/mortael/HAR-Insight-Pro/issues)
- **Documentation**: See `BUILDING.md` for developer documentation
- **Community**: Check existing issues for solutions

## Credits

HAR Insight Pro is built with:
- Electron for desktop functionality
- React for the user interface
- Vite for fast builds
- Tailwind CSS for styling

## License

HAR Insight Pro is open-source software licensed under the MIT License.

---

**Version**: 1.0.0
**Last Updated**: May 2026
