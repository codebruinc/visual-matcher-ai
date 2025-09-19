# Visual Matcher AI <¯

A powerful visual comparison tool designed specifically for AI coding agents to achieve pixel-perfect website matching. Born from real-world experience building 1:1 website clones with AI assistance.

## =€ Features

- **Pixel-Perfect Comparison**: Advanced image comparison using Puppeteer, Sharp, and Pixelmatch
- **Smart Scroll Detection**: Automatically finds optimal scroll positions for best matching
- **Continuous Monitoring**: Real-time visual regression testing during development
- **AI Agent Integration**: Purpose-built for Claude Code, Cursor AI, and other AI coding tools
- **CLI & API**: Both command-line interface and programmatic access
- **Detailed Reporting**: Comprehensive similarity scores and visual diff generation

## =æ Installation

### Global Installation (CLI)
```bash
npm install -g visual-matcher-ai
```

### Local Installation (API)
```bash
npm install visual-matcher-ai
```

## =¥ CLI Usage

### Basic Comparison
```bash
visual-matcher compare -u http://localhost:3000 -r ./reference.png
```

### Find Optimal Scroll Position
```bash
visual-matcher find-best -u http://localhost:3000 -r ./reference.png --start 0 --end 1500 --step 50
```

### Continuous Monitoring
```bash
visual-matcher watch -u http://localhost:3000 -r ./reference.png --interval 15
```

### Advanced Options
```bash
visual-matcher compare \\
  --url http://localhost:3000 \\
  --reference ./target-design.png \\
  --output ./results \\
  --width 1920 \\
  --height 880 \\
  --scroll-y 900 \\
  --threshold 0.1
```

## =Ú API Usage

### Quick Comparison
```javascript
const { compareScreenshots } = require('visual-matcher-ai');

const result = await compareScreenshots('http://localhost:3000', './reference.png', {
  viewport: { width: 1920, height: 880 },
  scrollY: 900
});

console.log(`Similarity: ${result.similarity}%`);
```

### Advanced Usage
```javascript
const { VisualMatcher } = require('visual-matcher-ai');

const matcher = new VisualMatcher({
  viewport: { width: 1920, height: 880 },
  threshold: 0.1
});

// Find best scroll position
const bestMatch = await matcher.findOptimalScrollPosition(
  'http://localhost:3000',
  './reference.png',
  { startY: 0, endY: 2000, step: 50 }
);

// Continuous monitoring
await matcher.continuousMatch('http://localhost:3000', './reference.png', {
  interval: 15000,
  onUpdate: (result) => {
    console.log(`Current similarity: ${result.similarity}%`);
    if (result.similarity > 95) {
      console.log('<‰ Target achieved!');
    }
  }
});

await matcher.close();
```

## > AI Agent Integration

### Claude Code
```markdown
I'm building a website clone and need to achieve 95%+ visual similarity.

1. Start visual monitoring:
   \`\`\`bash
   visual-matcher watch -u http://localhost:3000 -r ./target.png --interval 10
   \`\`\`

2. Make incremental changes to match the reference
3. Monitor similarity scores in real-time
4. Focus on major differences (>5% improvement) before micro-optimizations
```

### Cursor AI Integration
```javascript
// Add to your workspace settings
{
  "visualMatcher.autoStart": true,
  "visualMatcher.reference": "./design-reference.png",
  "visualMatcher.target": "http://localhost:3000",
  "visualMatcher.threshold": 95
}
```

### GitHub Codespaces / Dev Containers
```dockerfile
# Add to your Dockerfile
RUN npm install -g visual-matcher-ai

# In your dev container
EXPOSE 3000
CMD ["visual-matcher", "watch", "-u", "http://localhost:3000", "-r", "/workspace/reference.png"]
```

## <¨ Workflow Examples

### Perfect Landing Page Clone
```bash
# 1. Find optimal viewport and scroll position
visual-matcher find-best -u https://target-site.com -r ./downloaded-reference.png

# 2. Start continuous monitoring during development
visual-matcher watch -u http://localhost:3000 -r ./reference.png --scroll-y 900

# 3. Build and iterate until 95%+ similarity achieved
```

### Component-Level Matching
```javascript
const matcher = new VisualMatcher({
  viewport: { width: 1200, height: 800 }
});

// Test specific component sections
const headerMatch = await matcher.compareImages('./header-reference.png', './current-header.png');
const heroMatch = await matcher.compareImages('./hero-reference.png', './current-hero.png');

console.log(`Header: ${headerMatch.similarity}%, Hero: ${heroMatch.similarity}%`);
```

## =' Configuration Options

### VisualMatcher Options
```javascript
{
  headless: true,                    // Run browser in headless mode
  viewport: { width: 1920, height: 1080 },  // Browser viewport size
  threshold: 0.1,                    // Pixelmatch sensitivity (0-1)
  includeAA: false                   // Include anti-aliasing in comparison
}
```

### Comparison Options
```javascript
{
  scrollY: 900,                      // Specific scroll position
  fullPage: false,                   // Full page screenshot
  outputPath: './screenshot.png',    // Custom screenshot path
  diffPath: './diff.png'            // Custom diff image path
}
```

## =È Understanding Results

### Similarity Scores
- **95-100%**: Pixel-perfect match (
- **85-94%**: Excellent match 
- **70-84%**: Good match, minor tweaks needed  
- **<70%**: Major structural differences L

### Optimization Strategy
1. **Start with major layout issues** (backgrounds, positioning)
2. **Fix structural problems** before micro-optimizations
3. **Use proper viewport and scroll position** from reference
4. **Focus on 5-10% improvements** rather than 1-2% tweaks
5. **Test at optimal scroll position** for accurate comparison

## =¨ Common Issues & Solutions

### Browser Compatibility
```bash
# Install Chromium dependencies on Linux
apt-get install -y chromium-browser

# Docker Alpine
apk add chromium
```

### Memory Issues
```javascript
// Limit concurrent operations
const matcher = new VisualMatcher({ headless: true });
// Always close matcher when done
await matcher.close();
```

### Network Timeouts
```javascript
// Increase timeout for slow sites
await page.goto(url, {
  waitUntil: 'networkidle0',
  timeout: 60000
});
```

## > Contributing

We welcome contributions! This tool was created from real experience building pixel-perfect clones with AI coding agents.

### Development Setup
```bash
git clone https://github.com/codebru/visual-matcher-ai.git
cd visual-matcher-ai
npm install
npm run test
```

### Running Examples
```bash
npm run example  # Run CodeBru example
```

## =Ä License

MIT © CodeBru Team

## < Success Stories

This tool was battle-tested while building a 1:1 clone of CodeBru.com, achieving 86% similarity through systematic optimization. Key learnings:

- **Proper viewport matching** is crucial (880px vs 1080px made huge difference)
- **Optimal scroll position** discovery improved accuracy by 40%
- **Continuous monitoring** prevented regressions during development
- **Focus on major fixes first** - 5% improvements vs 1% micro-optimizations

---

Built with d for the AI coding community. Happy cloning! <¯