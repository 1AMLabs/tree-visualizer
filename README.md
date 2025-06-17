# 📁 file-tree

[![Build Status](https://github.com/1AMLabs/tree-visualizer/actions/workflows/node.js.yml/badge.svg)](https://github.com/1AMLabs/tree-visualizer/actions/workflows/node.js.yml)
[![NPM version](https://img.shields.io/npm/v/file-tree.svg)](https://www.npmjs.com/package/file-tree)
[![License](https://img.shields.io/npm/l/file-tree)](./LICENSE)
[![Node.js](https://img.shields.io/node/v/file-tree)](https://nodejs.org)
[![Downloads](https://img.shields.io/npm/dm/file-tree.svg)](https://www.npmjs.com/package/file-tree)

> 🧰 Generate a clean and customizable visual file tree of any directory from your terminal.

---

## ✨ Features

- 📂 Outputs a visual tree of files and folders
- 🚫 Supports ignoring files via `.gitignore`, `.file-tree-ignore`, or CLI patterns
- 📏 Optionally includes file sizes
- 📉 Configurable maximum folder depth
- 🖨️ Outputs to console or a file

---

## 📦 Installation

```sh
npm install -g file-tree
```

## 🛠️ Usage

```sh
file-tree [options]
```

| Option                | Description                                                                 |
| --------------------- | --------------------------------------------------------------------------- |
| `--start <dir>`       | Directory to start scanning (default: `.`)                                  |
| `--out <file>`        | Output file path (writes plain text tree)                                   |
| `--ignore <patterns>` | Ignore patterns (comma-separated or repeated, e.g., `node_modules,**/*.ts`) |
| `--sizes`             | Include file sizes in the output                                            |
| `--max-depth <n>`     | Maximum folder depth to scan (default: unlimited)                           |
| `--debug`             | Enable debug logging                                                        |
| `--use-gitignore`     | Use `.gitignore` patterns for ignoring files                                |


## 🧪 Examples
Display the file tree of the current directory:

```sh
file-tree
```
Scan a specific folder while ignoring node_modules and TypeScript files:

```sh
file-tree --start src --ignore node_modules,**/*.ts
```
Include file sizes and limit the depth to 2 levels:

```sh
file-tree --sizes --max-depth 2
```
Write the result to a file:

```sh
file-tree --out tree.txt
```
Use your project's .gitignore for ignore patterns:

```sh
file-tree --use-gitignore
```

## 🧩 Programmatic Usage
You can also use file-tree as a library in your Node.js projects:

```ts
import { generateTree } from 'file-tree';

await generateTree(
  './my-folder',
  'tree.txt',
  ['node_modules', '**/*.log'],
  { showSizes: true, maxDepth: 2, debug: false }
);
```

## 📄 License
MIT © 1AMLabs
