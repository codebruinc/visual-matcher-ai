const VisualMatcher = require('./VisualMatcher');

module.exports = {
  VisualMatcher,

  // Convenience methods for quick usage
  async compareScreenshots(url, referenceImage, options = {}) {
    const matcher = new VisualMatcher(options);
    try {
      const screenshotPath = options.outputPath || './temp-screenshot.png';
      await matcher.takeScreenshot(url, screenshotPath);

      const diffPath = options.diffPath || './temp-diff.png';
      const result = await matcher.compareImages(referenceImage, screenshotPath, diffPath);

      return {
        ...result,
        screenshotPath,
        url
      };
    } finally {
      await matcher.close();
    }
  },

  async findBestMatch(url, referenceImage, options = {}) {
    const matcher = new VisualMatcher(options);
    try {
      return await matcher.findOptimalScrollPosition(url, referenceImage, options);
    } finally {
      await matcher.close();
    }
  },

  async startContinuousMatching(url, referenceImage, options = {}) {
    const matcher = new VisualMatcher(options);
    // Note: matcher.close() should be called externally when stopping
    return matcher.continuousMatch(url, referenceImage, options);
  }
};