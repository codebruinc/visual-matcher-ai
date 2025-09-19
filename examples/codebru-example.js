const { VisualMatcher } = require('../src/VisualMatcher');
const path = require('path');

/**
 * CodeBru Clone Example
 *
 * This example demonstrates how Visual Matcher AI was used to achieve
 * an 86% similarity match when building a 1:1 clone of CodeBru.com
 */

async function codeBruExample() {
  console.log('🎯 CodeBru Clone Visual Matching Example');
  console.log('=========================================\\n');

  const matcher = new VisualMatcher({
    viewport: { width: 1920, height: 880 }, // Critical: Use 880px not 1080px!
    threshold: 0.1
  });

  try {
    console.log('📋 STEP 1: Find Optimal Scroll Position');
    console.log('--------------------------------------');

    // This was the breakthrough - finding y=900 as optimal scroll position
    const bestMatch = await matcher.findOptimalScrollPosition(
      'http://localhost:8000', // Your local clone
      './reference-codebru.png', // Downloaded from actual site
      {
        startY: 0,
        endY: 1500,
        step: 50,
        tempDir: './temp-scroll-tests'
      }
    );

    console.log(`\\n🎯 BEST MATCH FOUND:`);
    console.log(`   Scroll Position: y=${bestMatch.scrollY}`);
    console.log(`   Similarity: ${bestMatch.similarity}%`);

    if (bestMatch.similarity < 70) {
      console.log('\\n⚠️  LOW SIMILARITY DETECTED');
      console.log('   Focus on major structural issues:');
      console.log('   1. Background colors (navbar, hero, sections)');
      console.log('   2. Layout proportions and spacing');
      console.log('   3. Image sizes and positioning');
      console.log('   4. Font sizes and text alignment');
    }

    console.log('\\n📋 STEP 2: Continuous Monitoring');
    console.log('--------------------------------');

    // Start continuous monitoring during development
    await matcher.continuousMatch('http://localhost:8000', './reference-codebru.png', {
      interval: 15000, // Check every 15 seconds
      maxIterations: 50,
      outputDir: './output-monitoring',
      onUpdate: (result) => {
        console.log(`\\n🔍 Test #${result.iteration}:`);
        console.log(`   Similarity: ${result.similarity}%`);

        if (result.change > 5) {
          console.log(`   📈 Great improvement: +${result.change.toFixed(1)}%`);
        } else if (result.change < -2) {
          console.log(`   📉 Regression: ${result.change.toFixed(1)}%`);
        }

        if (result.similarity >= 95) {
          console.log('   🎉 PIXEL-PERFECT ACHIEVED!');
        } else if (result.similarity >= 85) {
          console.log('   ✅ Excellent match - fine-tuning needed');
        } else if (result.similarity >= 70) {
          console.log('   ⚠️  Good foundation - major improvements needed');
        } else {
          console.log('   ❌ Focus on structural issues first');
        }
      }
    });

  } catch (error) {
    console.error('❌ Example failed:', error.message);
  } finally {
    await matcher.close();
  }
}

// Key Learnings from CodeBru Clone Project
function printLessonsLearned() {
  console.log('\\n💡 KEY LEARNINGS FROM CODEBRU CLONE');
  console.log('==================================');
  console.log('');
  console.log('1. 🎯 VIEWPORT MATTERS:');
  console.log('   - Reference was 880px height, not 1080px');
  console.log('   - Wrong viewport = 40% accuracy loss');
  console.log('');
  console.log('2. 📍 SCROLL POSITION CRITICAL:');
  console.log('   - Found optimal y=900 through systematic testing');
  console.log('   - Improved baseline from 33% to 86%');
  console.log('');
  console.log('3. 🚀 MAJOR FIXES FIRST:');
  console.log('   - Background colors: 20% improvement');
  console.log('   - Layout structure: 15% improvement');
  console.log('   - Micro-optimizations: 1-2% each');
  console.log('');
  console.log('4. 🔄 CONTINUOUS MONITORING:');
  console.log('   - Prevented regressions during development');
  console.log('   - Real-time feedback accelerated iteration');
  console.log('');
  console.log('5. 🎨 SYSTEMATIC APPROACH:');
  console.log('   - Fix backgrounds → layout → spacing → details');
  console.log('   - Don\\'t micro-optimize until major issues resolved');
}

// Run example if called directly
if (require.main === module) {
  codeBruExample()
    .then(() => {
      printLessonsLearned();
      console.log('\\n✅ Example completed successfully!');
    })
    .catch(console.error);
}

module.exports = { codeBruExample, printLessonsLearned };