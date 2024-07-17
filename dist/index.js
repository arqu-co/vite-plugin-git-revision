// src/helpers/run-git-command.ts
import * as child from "child_process";
import * as path from "path";

// src/helpers/remove-empty-lines.ts
function removeEmptyLines(string) {
  return string.replace(/[\s\r\n]+$/, "");
}

// src/helpers/run-git-command.ts
var { exec, execSync } = child;
function runGitCommand(gitWorkTree, command, callback) {
  const gitCommand = gitWorkTree ? [
    "git",
    "--git-dir=" + path.join(gitWorkTree, ".git"),
    "--work-tree=" + gitWorkTree,
    command
  ].join(" ") : [
    "git",
    command
  ].join(" ");
  if (callback) {
    exec(gitCommand, function(err, stdout) {
      if (err) {
        return callback(err);
      }
      callback(null, removeEmptyLines(stdout));
    });
  } else {
    return removeEmptyLines("" + execSync(gitCommand));
  }
}

// src/index.ts
var COMMITHASH_COMMAND = "rev-parse HEAD";
var VERSION_COMMAND = "describe --always";
var BRANCH_COMMAND = "rev-parse --abbrev-ref HEAD";
var defaultOpt = {
  lightweightTags: false,
  branch: false,
  commithashCommand: COMMITHASH_COMMAND,
  versionCommand: VERSION_COMMAND,
  branchCommand: BRANCH_COMMAND
};
function GitRevision(options) {
  options = Object.assign(defaultOpt, options ? options : {});
  if (options.versionCommand && options.lightweightTags) {
    throw new Error("lightweightTags can't be used together versionCommand");
  }
  return {
    name: "vite:git-revision",
    config(config) {
      const { define = {} } = config;
      config.define = {
        ...define,
        GITVERSION: JSON.stringify(runGitCommand(options.gitWorkTree, options.versionCommand)),
        GITBRANCH: JSON.stringify(runGitCommand(options.gitWorkTree, options.branchCommand))
      };
    }
  };
}
export {
  GitRevision as default
};
