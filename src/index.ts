import { getInput } from "@actions/core";
import semver from "semver";
import process from "process";

const red = (value: string) => `\u001b[31m${value}\u001b[39m`;
const green = (value: string) => `\u001b[32m${value}\u001b[39m`;
const magenta = (value: string) => `\u001b[35m${value}\u001b[39m`;
const cyan = (value: string) => `\u001b[36m${value}\u001b[39m`;

const checkIsValidVersion = (type: string, version: string) => {
  if (!semver.valid(version)) {
    console.log(`${type} version (${red(version)}) is not a valid version.`);
    process.exit(1);
  }
};

export const run = () => {
  const currentVersion = getInput("current_version");
  if (!semver.valid(currentVersion)) {
    console.log(`Current version (${red(currentVersion)}) is not a valid.`);
    process.exit(1);
    return;
  }

  const branchVersion = getInput("branch_version");
  if (!semver.valid(branchVersion)) {
    console.log(`Branch version (${red(branchVersion)}) is not a valid.`);
    process.exit(1);
    return;
  }

  const nextPatchVersion = semver.inc(currentVersion, "patch") || "";
  const nextMinorVersion = semver.inc(currentVersion, "minor") || "";
  const nextMajorVersion = semver.inc(currentVersion, "major") || "";

  const validVersions = [nextPatchVersion, nextMinorVersion, nextMajorVersion];

  if (!validVersions.includes(branchVersion)) {
    console.log(`Current branch version ${red(branchVersion)} is not one of:`);
    console.log(`• ${magenta("Patch")} version: ${magenta(nextPatchVersion)}`);
    console.log(`• ${cyan("Minor")} version: ${cyan(nextMinorVersion)}`);
    console.log(`• ${green("Major")} version: ${green(nextMajorVersion)}`);
    process.exit(1);
    return;
  }

  process.exit(0);
};
