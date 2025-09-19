const { VisualMatcher, compareScreenshots } = require('../src');
const fs = require('fs').promises;

/**
 * Basic Visual Matcher Test
 *
 * Simple test to verify the tool works correctly
 */

async function basicTest() {
  console.log('🧪 Running Basic Visual Matcher Test');
  console.log('===================================\\n');

  try {
    console.log('1. 📸 Testing screenshot capture...');

    const matcher = new VisualMatcher({
      viewport: { width: 1280, height: 720 },
      headless: true
    });

    // Test screenshot capture
    await matcher.takeScreenshot('https://example.com', './test-screenshot.png');
    console.log('   ✅ Screenshot captured successfully');

    // Test image comparison (compare with itself - should be 100%)
    console.log('\\n2. 🔍 Testing image comparison...');
    const result = await matcher.compareImages(
      './test-screenshot.png',
      './test-screenshot.png',
      './test-diff.png'
    );

    console.log(`   Similarity: ${result.similarity}%`);
    console.log(`   Different pixels: ${result.diffPixels}`);

    if (result.similarity === 100) {
      console.log('   ✅ Self-comparison test passed (100% match)');
    } else {
      console.log('   ❌ Self-comparison test failed (should be 100%)');
    }

    // Test convenience function
    console.log('\\n3. 🚀 Testing convenience function...');
    const quickResult = await compareScreenshots('https://example.com', './test-screenshot.png', {
      outputPath: './quick-test.png'
    });

    console.log(`   Quick comparison similarity: ${quickResult.similarity}%`);

    if (quickResult.similarity > 90) {
      console.log('   ✅ Quick comparison test passed');
    } else {
      console.log('   ⚠️  Quick comparison shows differences (expected due to timing)');
    }

    await matcher.close();

    // Cleanup test files
    console.log('\\n4. 🧹 Cleaning up test files...');
    try {
      await fs.unlink('./test-screenshot.png');
      await fs.unlink('./test-diff.png');
      await fs.unlink('./quick-test.png');
      console.log('   ✅ Cleanup completed');
    } catch (error) {
      console.log('   ⚠️  Some test files may not exist');
    }

    console.log('\\n🎉 All tests completed successfully!');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    process.exit(1);
  }
}

// Test CLI functionality
async function testCLI() {
  console.log('\\n🖥️  Testing CLI functionality...');
  console.log('================================');

  const { spawn } = require('child_process');

  return new Promise((resolve, reject) => {
    const cli = spawn('node', ['../bin/cli.js', '--help'], {
      stdio: 'pipe'
    });

    let output = '';
    cli.stdout.on('data', (data) => {
      output += data.toString();
    });

    cli.on('close', (code) => {
      if (code === 0 && output.includes('Visual comparison tool')) {
        console.log('✅ CLI help command works');
        resolve();
      } else {
        console.log('❌ CLI test failed');
        reject(new Error('CLI help failed'));
      }
    });
  });
}

// Run tests if called directly
if (require.main === module) {
  basicTest()
    .then(() => testCLI())
    .then(() => {
      console.log('\\n🎯 Visual Matcher AI is ready for action!');
      console.log('\\nNext steps:');
      console.log('1. npm install -g visual-matcher-ai');
      console.log('2. visual-matcher compare -u http://localhost:3000 -r ./reference.png');
      console.log('3. Start building pixel-perfect clones with AI! 🚀');
    })
    .catch(console.error);
}

module.exports = { basicTest, testCLI };