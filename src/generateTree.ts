import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { minimatch } from 'minimatch';
import { ITreeOptions } from './types/TreeOptions.js';
import type { IEntry } from './types/TreeOptions.js';
import { formatSize } from './utils/formatSize.js';
import { loadIgnoreFile, loadGitignoreFile } from './utils/ignoreFiles.js';

let ignored: string[] = [];


function isIgnored(relPath: string, debug = false): boolean {
	const match = ignored.some((pattern) => minimatch(relPath, pattern));
	if (debug) {
		if (match) {
			console.log(`⏭ Ignored: ${relPath}`);
		} else {
			console.log(`✅ Included: ${relPath}`);
		}
	}
	return match;
}

async function walk(
	dir: string,
	depth = 0,
	prefix = '',
	root = dir,
	options: { showSizes: boolean; maxDepth: number; debug: boolean }
): Promise<IEntry[]> {
	if (depth > options.maxDepth) return [];

	const files = await fs.readdir(dir, { withFileTypes: true });
	const entries: IEntry[] = [];

	for (const [i, file] of files.entries()) {
		const isLast = i === files.length - 1;
		const branch = isLast ? '└── ' : '├── ';
		const nextPrefix = prefix + (isLast ? '    ' : '│   ');
		const fullPath = path.join(dir, file.name);
		const relPath = path.relative(root, fullPath).replace(/\\/g, '/');

		if (isIgnored(relPath, options.debug)) continue;

		const stats = await fs.stat(fullPath);
		const sizeLabel =
			options.showSizes && file.isFile() ? ` (${formatSize(stats.size)})` : '';

		const label = file.isDirectory()
			? chalk.blue.bold(file.name + '/')
			: file.name + sizeLabel;

		const rawLabel = file.isDirectory()
			? file.name + '/'
			: file.name + sizeLabel;

		entries.push({
			display: `${prefix}${branch}${label}`,
			raw: `${prefix}${branch}${rawLabel}`
		});

		if (file.isDirectory()) {
			const subTree = await walk(fullPath, depth + 1, nextPrefix, root, options);
			entries.push(...subTree);
		}
	}
	return entries;
}

export async function generateTree(
	startPath: string,
	outPath: string | null,
	cliIgnore: string[] | null,
	options: ITreeOptions
): Promise<void> {
		if (cliIgnore?.length) {
			ignored = cliIgnore;
		} else if (options.useGitignore) {
			const ignoreFiles = await loadGitignoreFile("./");
			ignored = [...ignoreFiles];
		} else {
			const ignoreFiles = await loadIgnoreFile("./");
			ignored = [...ignoreFiles];
		}

	// Check if startPath exists and is a directory
	try {
		const stat = await fs.stat(startPath);
		if (!stat.isDirectory()) {
			console.error(chalk.red(`Error: ${startPath} is not a directory.`));
			process.exit(1);
		}
	} catch (err) {
		console.error(chalk.red(`Error: Directory ${startPath} does not exist.`));
		process.exit(1);
	}

	const rootName = path.basename(startPath);
	const displayRoot = chalk.green.bold(rootName + '/');
	const rawRoot = rootName + '/';

	const entries = await walk(startPath, 0, '', startPath, options);
	const display = [displayRoot, ...entries.map((e) => e.display)].join('\n');
	const raw = [rawRoot, ...entries.map((e) => e.raw)].join('\n');

	if (outPath) {
		await fs.writeFile(outPath, raw);
		console.log(`✅ File tree written to ${outPath}`);
	} else {
		console.log(display);
	}
}
