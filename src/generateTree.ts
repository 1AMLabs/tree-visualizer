#!/usr/bin/env node

import fs from 'fs/promises';
import path from 'path';
import chalk from 'chalk';
import { minimatch } from 'minimatch';
import { ITreeOptions } from './types/TreeOptions.js';
import type { IEntry } from './types/TreeOptions.js';
import { formatSize } from './utils/formatSize.js';
import { loadIgnoreFile, loadGitignoreFile } from './utils/ignoreFiles.js';
import Moment from 'moment';

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
	options: ITreeOptions
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
		const timestampLabel =
			options.timestamp && file.isFile() ? ` (${Moment(stats.mtime).format('YYYY-MM-DD HH:mm:ss')})` : '';

		const label = file.isDirectory()
			? chalk.blue.bold(file.name + '/')
			: file.name + sizeLabel + timestampLabel;

		const rawLabel = file.isDirectory()
			? file.name + '/'
			: file.name + sizeLabel + timestampLabel;

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
		const ignoreFiles = await loadGitignoreFile(startPath);
		ignored = [...ignoreFiles];
	} else {
		const ignoreFiles = await loadIgnoreFile(startPath);
		ignored = [...ignoreFiles];
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
