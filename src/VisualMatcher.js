const puppeteer = require('puppeteer');
const sharp = require('sharp');
const pixelmatch = require('pixelmatch');
const fs = require('fs').promises;
const path = require('path');

class VisualMatcher {
  constructor(options = {}) {
    this.options = {
      headless: true,
      viewport: { width: 1920, height: 1080 },
      threshold: 0.1, // pixelmatch threshold
      includeAA: false, // include anti-aliasing
      ...options
    };
    this.browser = null;
  }

  async init() {
    if (!this.browser) {
      this.browser = await puppeteer.launch({
        headless: this.options.headless,
        args: ['--no-sandbox', '--disable-setuid-sandbox']
      });
    }
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
      this.browser = null;
    }
  }

  async takeScreenshot(url, outputPath, options = {}) {
    await this.init();
    const page = await this.browser.newPage();

    try {
      await page.setViewport(this.options.viewport);
      await page.goto(url, { waitUntil: 'networkidle0' });

      if (options.scrollY !== undefined) {
        await page.evaluate((scrollY) => window.scrollTo(0, scrollY), options.scrollY);
        await page.waitForTimeout(500); // Wait for scroll to complete
      }

      await page.screenshot({
        path: outputPath,
        fullPage: options.fullPage || false
      });

      return outputPath;
    } finally {
      await page.close();
    }
  }

  async compareImages(image1Path, image2Path, diffOutputPath) {
    try {
      // Load and process images
      const img1Buffer = await fs.readFile(image1Path);
      const img2Buffer = await fs.readFile(image2Path);

      // Get image dimensions and ensure they match
      const img1 = sharp(img1Buffer);
      const img2 = sharp(img2Buffer);

      const img1Meta = await img1.metadata();
      const img2Meta = await img2.metadata();

      // Resize images to match dimensions if needed
      const targetWidth = Math.max(img1Meta.width, img2Meta.width);
      const targetHeight = Math.max(img1Meta.height, img2Meta.height);

      const img1Raw = await img1
        .resize(targetWidth, targetHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

      const img2Raw = await img2
        .resize(targetWidth, targetHeight, { fit: 'contain', background: { r: 255, g: 255, b: 255, alpha: 1 } })
        .raw()
        .ensureAlpha()
        .toBuffer({ resolveWithObject: true });

      // Create diff image buffer
      const diffBuffer = Buffer.alloc(img1Raw.data.length);

      // Compare images
      const diffPixels = pixelmatch(
        img1Raw.data,
        img2Raw.data,
        diffBuffer,
        targetWidth,
        targetHeight,
        {
          threshold: this.options.threshold,
          includeAA: this.options.includeAA
        }
      );

      // Save diff image
      await sharp(diffBuffer, {
        raw: {
          width: targetWidth,
          height: targetHeight,
          channels: 4
        }
      })
      .png()
      .toFile(diffOutputPath);

      const totalPixels = targetWidth * targetHeight;
      const similarity = Math.round(((totalPixels - diffPixels) / totalPixels) * 100);

      return {
        similarity,
        diffPixels,
        totalPixels,
        diffImagePath: diffOutputPath,
        dimensions: { width: targetWidth, height: targetHeight }
      };
    } catch (error) {
      throw new Error(`Image comparison failed: ${error.message}`);
    }
  }

  async findOptimalScrollPosition(url, referenceImagePath, options = {}) {
    const {
      startY = 0,
      endY = 2000,
      step = 50,
      tempDir = './temp',
      prefix = 'scroll-test'
    } = options;

    await this.init();

    // Ensure temp directory exists
    try {
      await fs.mkdir(tempDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    let bestMatch = {
      scrollY: 0,
      similarity: 0,
      screenshotPath: '',
      diffPath: ''
    };

    console.log(`🔍 Finding optimal scroll position from ${startY} to ${endY} (step: ${step})`);

    for (let y = startY; y <= endY; y += step) {
      const screenshotPath = path.join(tempDir, `${prefix}-${y}.png`);
      const diffPath = path.join(tempDir, `${prefix}-${y}-diff.png`);

      try {
        // Take screenshot at current scroll position
        await this.takeScreenshot(url, screenshotPath, { scrollY: y });

        // Compare with reference
        const comparison = await this.compareImages(referenceImagePath, screenshotPath, diffPath);

        if (comparison.similarity > bestMatch.similarity) {
          console.log(`✅ New best at y=${y}: ${comparison.similarity}%`);
          bestMatch = {
            scrollY: y,
            similarity: comparison.similarity,
            screenshotPath,
            diffPath,
            ...comparison
          };
        }
      } catch (error) {
        console.warn(`⚠️  Failed to test scroll position ${y}: ${error.message}`);
      }
    }

    return bestMatch;
  }

  async continuousMatch(url, referenceImagePath, options = {}) {
    const {
      interval = 15000, // 15 seconds
      maxIterations = 100,
      outputDir = './output',
      onUpdate = null
    } = options;

    await this.init();

    // Ensure output directory exists
    try {
      await fs.mkdir(outputDir, { recursive: true });
    } catch (error) {
      // Directory already exists
    }

    let iteration = 1;
    let previousSimilarity = 0;

    console.log('🔧 Starting continuous visual matching...');
    console.log(`👀 Monitoring every ${interval/1000} seconds`);

    const runTest = async () => {
      if (iteration > maxIterations) {
        console.log(`🛑 Reached maximum iterations (${maxIterations})`);
        return;
      }

      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const screenshotPath = path.join(outputDir, `test-${iteration}-${timestamp}.png`);
      const diffPath = path.join(outputDir, `diff-${iteration}-${timestamp}.png`);

      try {
        console.log(`\\n🔍 Running Test #${iteration} at ${new Date().toLocaleTimeString()}`);
        console.log('==================================================');

        await this.takeScreenshot(url, screenshotPath);
        const comparison = await this.compareImages(referenceImagePath, screenshotPath, diffPath);

        const changeText = iteration > 1 ? this.getChangeText(comparison.similarity, previousSimilarity) : '';

        console.log(`📸 Screenshot saved: ${path.basename(screenshotPath)}`);
        console.log(`📊 Similarity Score: ${comparison.similarity}%`);
        if (changeText) console.log(changeText);
        console.log(`${this.getStatusEmoji(comparison.similarity)} ${this.getStatusText(comparison.similarity)}`);
        console.log(`🔍 Different pixels: ${(comparison.diffPixels / comparison.totalPixels * 100).toFixed(2)}%`);

        if (onUpdate) {
          onUpdate({
            iteration,
            similarity: comparison.similarity,
            change: comparison.similarity - previousSimilarity,
            screenshotPath,
            diffPath,
            ...comparison
          });
        }

        previousSimilarity = comparison.similarity;
        iteration++;

        setTimeout(runTest, interval);
      } catch (error) {
        console.error(`❌ Test #${iteration} failed:`, error.message);
        setTimeout(runTest, interval);
      }
    };

    runTest();
  }

  getChangeText(current, previous) {
    const change = current - previous;
    if (change > 0.5) return `📈 Improvement: +${change.toFixed(1)}%`;
    if (change < -0.5) return `📉 Regression: ${change.toFixed(1)}%`;
    return '➡️  No significant change';
  }

  getStatusEmoji(similarity) {
    if (similarity >= 95) return '🎉';
    if (similarity >= 85) return '✅';
    if (similarity >= 70) return '⚠️';
    return '❌';
  }

  getStatusText(similarity) {
    if (similarity >= 95) return 'Excellent match';
    if (similarity >= 85) return 'Good match';
    if (similarity >= 70) return 'Needs improvement';
    return 'Major fixes needed';
  }
}

module.exports = VisualMatcher;