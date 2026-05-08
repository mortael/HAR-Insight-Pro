const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const buildDir = path.join(__dirname, '..', 'build');
const svgPath = path.join(buildDir, 'icon.svg');

// Ensure build directory exists
if (!fs.existsSync(buildDir)) {
  fs.mkdirSync(buildDir, { recursive: true });
}

// Generate PNG icons at different sizes
const sizes = [16, 32, 48, 64, 128, 256, 512, 1024];

async function generateIcons() {
  console.log('Generating icons from SVG...');

  // Read SVG file
  const svgBuffer = fs.readFileSync(svgPath);

  // Generate PNG files
  for (const size of sizes) {
    const outputPath = path.join(buildDir, `icon_${size}x${size}.png`);
    await sharp(svgBuffer)
      .resize(size, size)
      .png()
      .toFile(outputPath);
    console.log(`✓ Created ${size}x${size} PNG`);
  }

  // Create main icon.png (512x512)
  await sharp(svgBuffer)
    .resize(512, 512)
    .png()
    .toFile(path.join(buildDir, 'icon.png'));
  console.log('✓ Created main icon.png');

  console.log('Icon generation complete!');
}

generateIcons().catch(console.error);
