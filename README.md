# 📁 tree-visualizer

[![Build Status](https://github.com/1AMLabs/tree-visualizer/actions/workflows/node.js.yml/badge.svg)](https://github.com/1AMLabs/tree-visualizer/actions/workflows/node.js.yml)
[![NPM version](https://img.shields.io/npm/v/tree-visualizer.svg)](https://www.npmjs.com/package/tree-visualizer)
[![License](https://img.shields.io/npm/l/tree-visualizer)](./LICENSE)
[![Node.js](https://img.shields.io/node/v/tree-visualizer)](https://nodejs.org)
[![Downloads](https://img.shields.io/npm/dm/tree-visualizer.svg)](https://www.npmjs.com/package/tree-visualizer)

> 🧰 Generate a clean and customizable visual file tree of any directory from your terminal.

---

## ✨ Features

- 📂 Outputs a visual tree of files and folders
- 🚫 Supports ignoring files via `.gitignore`, `.tree-visualizer-ignore`, or CLI patterns
- 📏 Optionally includes file sizes
- 📉 Configurable maximum folder depth
- 🖨️ Outputs to console or a file

---

## 📦 Installation

```sh
npm install -g tree-visualizer
```

## 🛠️ Usage

```sh
tree-visualizer [options]
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
tree-visualizer
```
Scan a specific folder while ignoring node_modules and TypeScript files:

```sh
tree-visualizer --start src --ignore node_modules,**/*.ts
```
Include file sizes and limit the depth to 2 levels:

```sh
tree-visualizer --sizes --max-depth 2
```
Write the result to a file:

```sh
tree-visualizer --out tree.txt
```
Use your project's .gitignore for ignore patterns:

```sh
tree-visualizer --use-gitignore
```

## 🧩 Programmatic Usage
You can also use tree-visualizer as a library in your Node.js projects:

```ts
import { generateTree } from 'tree-visualizer';

await generateTree(
  './my-folder',
  'tree.txt',
  ['node_modules', '**/*.log'],
  { showSizes: true, maxDepth: 2, debug: false }
);
```

## 📄 License
MIT © 1AMLabs
