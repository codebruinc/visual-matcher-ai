# Getting Started with Visual Matcher AI 🚀

## Quick Start

### 1. Installation
```bash
npm install -g visual-matcher-ai
```

### 2. Basic Usage
```bash
# Compare your local site with a reference image
visual-matcher compare -u http://localhost:3000 -r ./reference.png

# Find optimal scroll position
visual-matcher find-best -u http://localhost:3000 -r ./reference.png

# Start continuous monitoring
visual-matcher watch -u http://localhost:3000 -r ./reference.png --interval 10
```

## AI Agent Integration

### With Claude Code
```markdown
I need to build a pixel-perfect clone of this design.

Step 1: Start visual monitoring
\`\`\`bash
visual-matcher watch -u http://localhost:3000 -r ./target-design.png --interval 10
\`\`\`

Step 2: Make changes and watch similarity improve in real-time
Step 3: Focus on major improvements (5%+) before micro-optimizations
Step 4: Target 95%+ similarity for pixel-perfect match
```

### With Cursor AI
Add to your workspace:
```json
{
  "visual-matcher": {
    "enabled": true,
    "reference": "./design-reference.png",
    "target": "http://localhost:3000",
    "autoStart": true
  }
}
```

## Best Practices

### 🎯 Optimization Strategy
1. **Find optimal scroll position first** - can improve baseline by 40%
2. **Use correct viewport dimensions** - match your reference exactly
3. **Fix major layout issues first** - backgrounds, positioning, structure
4. **Continuous monitoring during development** - prevent regressions
5. **Focus on 5-10% improvements** rather than 1-2% micro-tweaks

### 📊 Similarity Score Guide
- **95-100%**: Pixel-perfect ✨
- **85-94%**: Excellent match ✅
- **70-84%**: Good foundation ⚠️
- **<70%**: Major structural work needed ❌

### 🔧 Common Issues
- Wrong viewport size (use same as reference)
- Comparing at wrong scroll position
- Network timing differences
- Missing dependencies (Chromium)

## Examples

### CodeBru Clone Success Story
This tool was battle-tested building a 1:1 CodeBru.com clone:
- Started at 33% similarity
- Found optimal scroll position (y=900) → 84%
- Fixed backgrounds → 86%
- Systematic optimization approach

Key lesson: **Major structural fixes first, micro-optimizations last**

### Component Testing
```javascript
const { VisualMatcher } = require('visual-matcher-ai');

const matcher = new VisualMatcher();

// Test individual components
const headerMatch = await matcher.compareImages(
  './header-reference.png',
  './current-header.png',
  './header-diff.png'
);

console.log(`Header similarity: ${headerMatch.similarity}%`);
```

## Troubleshooting

### Installation Issues
```bash
# Linux dependencies
apt-get install -y chromium-browser

# macOS
brew install chromium
```

### Memory Issues
```javascript
// Always close matcher when done
const matcher = new VisualMatcher({ headless: true });
// ... use matcher
await matcher.close();
```

### Permission Issues
```bash
# Make CLI executable
chmod +x ./bin/cli.js
```

## Next Steps

1. ✅ Install: `npm install -g visual-matcher-ai`
2. 📸 Get reference image of target design
3. 🚀 Start monitoring: `visual-matcher watch -u localhost:3000 -r ./ref.png`
4. 🔨 Build and iterate until 95%+ similarity
5. 🎉 Celebrate pixel-perfect clone!

---

**Happy cloning!** 🎯

Built by CodeBru.com for the AI coding community.