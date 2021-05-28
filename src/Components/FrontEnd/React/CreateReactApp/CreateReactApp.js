const path = require("path");
const { DeleteGitFolder, DeleteGitIgnore } = require("../../../../Scripts/Git");

const { Npx } = require(path.join(
  __dirname,
  "../../../../Scripts/PackageManager"
));
const {
  InstallPrettier,
  MrmLintStaged,
  ChangeLintStagedConfig,
  RunCleanScript,
  AddCleanCommand,
} = require("../../../../Scripts/Prettier");

const { GitAdd, GitCommit } = require(path.join("../../../../Scripts/Git"));

const RunCreateReactAppNpx = async () => {
  const { PackageManager, ProjectName, Log } = global.Config;

  await Npx(`create-react-app ${ProjectName}`, "", PackageManager, {
    stdio: `${Log ? "inherit" : "pipe"}`,
  });
};
const RunGitRemover = async () => {
  const { UseGit } = global.Config;
  if (!UseGit) {
    await DeleteGitFolder();
    await DeleteGitIgnore();
  }
};
const RunPrettierInstaller = async () => {
  const { UseGit, Prettier, GitForConfig, PackageManager } = global.Config;
  if (UseGit && Prettier) {
    try {
      await InstallPrettier(PackageManager);
      if (GitForConfig) {
        await GitAdd(".");
        await GitCommit("Added Prettier Package");
      }
      await MrmLintStaged(PackageManager);
      await ChangeLintStagedConfig();
      if (GitForConfig) {
        await GitAdd(".");
        await GitCommit("lint-staged will be Configured");
      }
      await AddCleanCommand();
      await RunCleanScript(PackageManager);
      if (GitForConfig) {
        await GitAdd(".");
        await GitCommit("All file cleaned with clean script");
      }
    } catch (err) {
      console.log(err);
      process.exit();
    }
  }
};
module.exports = async () => {
  const { ProjectName } = global.Config;
  await RunCreateReactAppNpx();
  process.chdir(path.join(process.cwd(), ProjectName));
  await RunPrettierInstaller();
  await RunGitRemover();
};
