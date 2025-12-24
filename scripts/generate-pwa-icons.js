import sharp from 'sharp'
import { promises as fs } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const SOURCE_SVG = join(__dirname, '..', 'public', 'brain-favicon.svg')
const OUTPUT_DIR = join(__dirname, '..', 'public', 'icons')

// Icon sizes for PWA
const STANDARD_SIZES = [72, 96, 128, 144, 152, 192, 384, 512]
const MASKABLE_SIZES = [192, 512]

// Theme color for maskable icon background
const THEME_COLOR = { r: 76, g: 175, b: 80, alpha: 1 } // #4CAF50

async function generateIcons() {
  console.log('🎨 Generating PWA icons from brain-favicon.svg...\n')

  // Create output directory if it doesn't exist
  try {
    await fs.mkdir(OUTPUT_DIR, { recursive: true })
    console.log(`✓ Created directory: ${OUTPUT_DIR}\n`)
  } catch (error) {
    if (error.code !== 'EEXIST') throw error
  }

  // Generate standard icons
  console.log('📦 Generating standard icons...')
  for (const size of STANDARD_SIZES) {
    const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}.png`)
    
    await sharp(SOURCE_SVG)
      .resize(size, size, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath)
    
    const stats = await fs.stat(outputPath)
    console.log(`  ✓ ${size}x${size}.png (${(stats.size / 1024).toFixed(1)} KB)`)
  }

  // Generate maskable icons with padding
  console.log('\n🎭 Generating maskable icons (with safe zone)...')
  for (const size of MASKABLE_SIZES) {
    const padding = Math.round(size * 0.1) // 10% padding on each side
    const innerSize = size - (padding * 2)
    const outputPath = join(OUTPUT_DIR, `icon-${size}x${size}-maskable.png`)
    
    await sharp(SOURCE_SVG)
      .resize(innerSize, innerSize, { 
        fit: 'contain',
        background: { r: 255, g: 255, b: 255, alpha: 0 }
      })
      .extend({
        top: padding,
        bottom: padding,
        left: padding,
        right: padding,
        background: THEME_COLOR
      })
      .png({ quality: 100, compressionLevel: 9 })
      .toFile(outputPath)
    
    const stats = await fs.stat(outputPath)
    console.log(`  ✓ ${size}x${size}-maskable.png (${(stats.size / 1024).toFixed(1)} KB)`)
  }

  console.log('\n✅ All PWA icons generated successfully!')
  console.log(`📁 Output directory: ${OUTPUT_DIR}`)
}

generateIcons().catch(error => {
  console.error('❌ Error generating icons:', error)
  process.exit(1)
})
