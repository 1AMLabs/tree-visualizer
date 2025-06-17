import fs from 'fs/promises';
import path from 'path';


export async function loadGitignoreFile(basePath: string): Promise<string[]> {
	const gitignorePath = path.join(basePath, '.gitignore');
    let ignored: string[];
	try {
		const data = await fs.readFile(gitignorePath, 'utf-8');
		ignored = data
			.split('\n')
			.map((line) => line.trim())
			.filter((line) => line && !line.startsWith('#'));

        return ignored;
	} catch {
		ignored = [];
        console.warn(`Warning: .gitignore file not found at ${gitignorePath}`);
        return ignored;
	}
}

export async function loadIgnoreFile(basePath: string): Promise<string[]> {
    const ignorePath = path.join(basePath, '.tree-visualizer-ignore');
    let ignored: string[];
    try {
        const data = await fs.readFile(ignorePath, 'utf-8');
        ignored = data
            .split('\n')
            .map((line) => line.trim())
            .filter((line) => line && !line.startsWith('#'));
        return ignored;
    } catch {
        ignored = [];

        console.warn(`Warning: .tree-visualizer-ignore file not found at ${ignorePath}`);
        return ignored;
    }
}