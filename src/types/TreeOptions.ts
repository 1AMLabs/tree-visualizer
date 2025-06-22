export interface ITreeOptions {
    showSizes: boolean;
    maxDepth: number;
    debug: boolean;
    useGitignore?: boolean;
    ignoreFile?: string;
    timestamp?: boolean;
}

export type IEntry = {
    display: string;
    raw: string;
};