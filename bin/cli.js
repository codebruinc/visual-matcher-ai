#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const path = require('path');
const VisualMatcher = require('../src/VisualMatcher');

const program = new Command();

program
  .name('visual-matcher')
  .description('Visual comparison tool for AI coding agents')
  .version('1.0.0');

program
  .command('compare')
  .description('Compare a live website with a reference image')
  .requiredOption('-u, --url <url>', 'URL of the website to test')
  .requiredOption('-r, --reference <path>', 'Path to reference image')
  .option('-o, --output <path>', 'Output directory for screenshots and diffs', './output')
  .option('-w, --width <number>', 'Viewport width', '1920')
  .option('-h, --height <number>', 'Viewport height', '1080')
  .option('--scroll-y <number>', 'Scroll to specific Y position')
  .option('--threshold <number>', 'Pixelmatch threshold (0-1)', '0.1')
  .action(async (options) => {
    const spinner = ora('Initializing visual matcher...').start();

    try {
      const matcher = new VisualMatcher({
        viewport: {
          width: parseInt(options.width),
          height: parseInt(options.height)
        },
        threshold: parseFloat(options.threshold)
      });

      spinner.text = 'Taking screenshot...';
      const screenshotPath = path.join(options.output, 'current-screenshot.png');
      await matcher.takeScreenshot(options.url, screenshotPath, {
        scrollY: options.scrollY ? parseInt(options.scrollY) : undefined
      });

      spinner.text = 'Comparing images...';
      const diffPath = path.join(options.output, 'comparison-diff.png');
      const result = await matcher.compareImages(options.reference, screenshotPath, diffPath);

      await matcher.close();
      spinner.stop();

      console.log('\\n' + chalk.green('✅ Comparison Complete!'));
      console.log(chalk.blue('📊 Results:'));
      console.log(`   Similarity: ${chalk.yellow(result.similarity + '%')}`);
      console.log(`   Different pixels: ${chalk.red(result.diffPixels.toLocaleString())}`);
      console.log(`   Total pixels: ${result.totalPixels.toLocaleString()}`);
      console.log('\\n' + chalk.blue('📁 Files generated:'));
      console.log(`   Screenshot: ${chalk.gray(screenshotPath)}`);
      console.log(`   Diff image: ${chalk.gray(diffPath)}`);

    } catch (error) {
      spinner.fail('Comparison failed');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('find-best')
  .description('Find optimal scroll position for best match')
  .requiredOption('-u, --url <url>', 'URL of the website to test')
  .requiredOption('-r, --reference <path>', 'Path to reference image')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('-s, --start <number>', 'Start scroll position', '0')
  .option('-e, --end <number>', 'End scroll position', '2000')
  .option('--step <number>', 'Step size for scroll testing', '50')
  .option('-w, --width <number>', 'Viewport width', '1920')
  .option('-h, --height <number>', 'Viewport height', '1080')
  .action(async (options) => {
    const spinner = ora('Finding optimal scroll position...').start();

    try {
      const matcher = new VisualMatcher({
        viewport: {
          width: parseInt(options.width),
          height: parseInt(options.height)
        }
      });

      spinner.stop();

      const result = await matcher.findOptimalScrollPosition(options.url, options.reference, {
        startY: parseInt(options.start),
        endY: parseInt(options.end),
        step: parseInt(options.step),
        tempDir: options.output
      });

      await matcher.close();

      console.log('\\n' + chalk.green('🎯 Best Match Found!'));
      console.log(`   Scroll position: ${chalk.yellow('y=' + result.scrollY)}`);
      console.log(`   Similarity: ${chalk.yellow(result.similarity + '%')}`);
      console.log(`   Screenshot: ${chalk.gray(result.screenshotPath)}`);
      console.log(`   Diff image: ${chalk.gray(result.diffPath)}`);

    } catch (error) {
      spinner.fail('Search failed');
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program
  .command('watch')
  .description('Continuously monitor website for changes')
  .requiredOption('-u, --url <url>', 'URL of the website to monitor')
  .requiredOption('-r, --reference <path>', 'Path to reference image')
  .option('-i, --interval <number>', 'Check interval in seconds', '15')
  .option('-m, --max <number>', 'Maximum iterations', '100')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('-w, --width <number>', 'Viewport width', '1920')
  .option('-h, --height <number>', 'Viewport height', '1080')
  .action(async (options) => {
    console.log(chalk.blue('🔧 Starting continuous monitoring...'));
    console.log(`URL: ${chalk.yellow(options.url)}`);
    console.log(`Interval: ${chalk.yellow(options.interval + 's')}`);
    console.log(`Max iterations: ${chalk.yellow(options.max)}`);

    try {
      const matcher = new VisualMatcher({
        viewport: {
          width: parseInt(options.width),
          height: parseInt(options.height)
        }
      });

      await matcher.continuousMatch(options.url, options.reference, {
        interval: parseInt(options.interval) * 1000,
        maxIterations: parseInt(options.max),
        outputDir: options.output
      });

    } catch (error) {
      console.error(chalk.red('Error:'), error.message);
      process.exit(1);
    }
  });

program.parse();