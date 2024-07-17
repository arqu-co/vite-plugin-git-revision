import { Plugin } from 'vite';

interface ViteGitRevisionPlugin {
    gitWorkTree?: any;
    lightweightTags?: boolean;
    branch?: boolean;
    commithashCommand?: string;
    versionCommand?: string;
    branchCommand?: string;
}
declare function GitRevision(options: ViteGitRevisionPlugin): Plugin;

export { ViteGitRevisionPlugin, GitRevision as default };
