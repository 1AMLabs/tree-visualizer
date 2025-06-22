#!/usr/bin/env node

import { Command } from 'commander';
import path from 'path';
import { fileURLToPath } from 'url';
import { generateTree } from './generateTree.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

program
  .name('tree-visualizer')
  .description('Generate a visual file tree of a directory')
  .option('--start <dir>', 'Directory to start scanning', '.')
  .option('--out <file>', 'Output file path')
  .option(
    '--ignore <items...>',
    'Comma-separated or multiple patterns to ignore (e.g. "node_modules,**/*.ts")'
  )
  .option('--sizes', 'Include file sizes in the output')
  .option('--timestamp', 'Include the timestamp of last modification')
  .option('--max-depth <n>', 'Maximum folder depth to scan', (v) => {
    const parsed = parseInt(v, 10);
    if (isNaN(parsed)) throw new Error('--max-depth must be a number');
    return parsed;
  }, Infinity)
  .option('--debug', 'Enable debug logging')
  .option('--use-gitignore', 'Use .gitignore patterns for ignoring files')
  .option('--ignore-file <file>', 'Path to a custom ignore file', '.treeignore')
  .parse();

const options = program.opts();

const startPath = path.resolve(process.cwd(), options.start);
const outPath = options.out ? path.resolve(process.cwd(), options.out) : null;

const ignoreList = options.ignore
  ? options.ignore.flatMap((str: string) =>
      str.split(',').map((s) => s.trim()).filter(Boolean)
    )
  : null;

await generateTree(startPath, outPath, ignoreList, {
  showSizes: options.sizes ?? false,
  maxDepth: options.maxDepth ?? Infinity,
  debug: options.debug ?? false,
  useGitignore: options.useGitignore ?? false,
  timestamp: options.timestamp ?? false
});


export { generateTree } from './generateTree.js';