export interface ITreeOptions {
    showSizes: boolean;
    maxDepth: number;
    debug: boolean;
    useGitignore?: boolean;
    ignoreFile?: string;
}

export type IEntry = {
    display: string;
    raw: string;
};