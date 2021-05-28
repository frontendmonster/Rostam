const { execSync } = require("child_process");
const ora = require("ora");

module.exports.YarnChecker = async (
  message = "You do not have yarn on your system, please install it to use it"
) => {
  const Spinner = ora("Checking that yarn is installed ...").start();

  try {
    await execSync("yarn -v");
    Spinner.succeed("yarn is install");
  } catch (err) {
    Spinner.fail("yarn is not install");
    console.error(message);
    process.exit();
  }
};
module.exports.AddPackage = async (Package, flags, PackageManager) => {
  const Spinner = ora(`installing ${Package} package ...`).start();
  const Command = `${
    PackageManager === "Yarn" ? "yarn add" : "Npm install"
  } ${flags} ${Package}`;
  try {
    await execSync(Command);
    Spinner.succeed(`${Package} installed`);
  } catch (err) {
    Spinner.fail("installing fail");
    console.error(err);
    process.exit();
  }
};
module.exports.Npx = async (
  Package,
  flags,
  PackageManager,
  ExecConfig = {}
) => {
  const Spinner = ora(`run ${Package} npx ...`).start();
  try {
    if (PackageManager === "Npm") {
      await execSync(`npx ${Package} ${flags} --use-npm`);
    } else {
      await execSync(`npx ${Package} ${flags}`, ExecConfig);
    }
    Spinner.succeed(`${Package} done`);
  } catch (err) {
    Spinner.fail(`${Package} Could not run`);
    console.error(err);
    process.exit();
  }
};
module.exports.RunScript = async (PackageManager, ScriptName) => {
  const Command = `${
    PackageManager === "Npm" ? "npm" : "yarn"
  } run ${ScriptName}`;
  const Spinner = ora(`Run ${ScriptName} Script`).start();
  try {
    await execSync(Command);
    Spinner.succeed(`${ScriptName} Script Done`);
  } catch (err) {
    Spinner.fail(`${ScriptName} Script failed`);
    console.log(err);
    process.exit();
  }
};
