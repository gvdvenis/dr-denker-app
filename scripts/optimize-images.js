import sharp from 'sharp';
import { readdir, mkdir, access, stat } from 'fs/promises';
import { join, extname } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { constants } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const SOURCE_DIR = join(__dirname, '../images');
const OUTPUT_DIR = join(__dirname, '../public/images');

async function optimizeImages() {
  try {
    // Create output directory if it doesn't exist
    await mkdir(OUTPUT_DIR, { recursive: true });
    
    // Read source directory
    const files = await readdir(SOURCE_DIR);
    
    console.log(`\n🖼️  Checking images for optimization...\n`);
    
    let totalOriginalSize = 0;
    let totalOptimizedSize = 0;
    let skippedCount = 0;
    let optimizedCount = 0;
    
    for (const file of files) {
      const ext = extname(file).toLowerCase();
      
      // Only process image files
      if (!['.png', '.jpg', '.jpeg', '.webp'].includes(ext)) {
        continue;
      }
      
      const inputPath = join(SOURCE_DIR, file);
      const outputPath = join(OUTPUT_DIR, file);
      
      // Check if output file already exists
      try {
        await access(outputPath, constants.F_OK);
        console.log(`⊘ ${file} - already optimized, skipping`);
        skippedCount++;
        continue;
      } catch {
        // File doesn't exist, proceed with optimization
      }
      
      try {
        // Get original file size
        const originalStats = await sharp(inputPath).metadata();
        const originalSize = originalStats.size || 0;
        totalOriginalSize += originalSize;
        
        // Optimize based on file type
        if (ext === '.png') {
          await sharp(inputPath)
            .png({ quality: 85, compressionLevel: 9 })
            .toFile(outputPath);
        } else if (['.jpg', '.jpeg'].includes(ext)) {
          await sharp(inputPath)
            .jpeg({ quality: 82, progressive: true })
            .toFile(outputPath);
        } else if (ext === '.webp') {
          await sharp(inputPath)
            .webp({ quality: 85 })
            .toFile(outputPath);
        }
        
        // Get optimized file size
        const optimizedStats = await sharp(outputPath).metadata();
        const optimizedSize = optimizedStats.size || 0;
        totalOptimizedSize += optimizedSize;
        
        const savings = ((originalSize - optimizedSize) / originalSize * 100).toFixed(1);
        console.log(`✓ ${file} - ${(originalSize / 1024).toFixed(1)}KB → ${(optimizedSize / 1024).toFixed(1)}KB (${savings}% saved)`);
        optimizedCount++;
        
      } catch (err) {
        console.error(`✗ Failed to optimize ${file}:`, err.message);
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   Optimized: ${optimizedCount} image(s)`);
    console.log(`   Skipped: ${skippedCount} image(s)`);
    
    if (optimizedCount > 0) {
      const totalSavings = ((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1);
      console.log(`   Total savings: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB → ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB (${totalSavings}% saved)`);
    }
    
    console.log('\n✨ Image optimization complete!\n');
    
  } catch (error) {
    console.error('Error optimizing images:', error);
    process.exit(1);
  }
}

optimizeImages();
