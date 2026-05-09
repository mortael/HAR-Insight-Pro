const pngToIco = require('png-to-ico');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const tauriIconsDir = path.join(__dirname, '..', 'src-tauri', 'icons');

async function generateIco() {
  console.log('Generating ICO file for Windows...');

  const pngFiles = [
    path.join(buildDir, 'icon_16x16.png'),
    path.join(buildDir, 'icon_32x32.png'),
    path.join(buildDir, 'icon_48x48.png'),
    path.join(buildDir, 'icon_256x256.png')
  ];

  try {
    const buf = await pngToIco(pngFiles);
    fs.writeFileSync(path.join(tauriIconsDir, 'icon.ico'), buf);
    console.log('✓ Created icon.ico for Windows');
  } catch (err) {
    console.error('Error creating ICO:', err);
  }
}

generateIco().catch(console.error);
