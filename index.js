import { exec } from "child_process";
import { promisify } from "util";

const execPromise = promisify(exec);

function execAsync(command) {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (stderr !== "") {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
}

async function updatePackageWithProgress(packageName) {
  let progress = 0;

  const interval = setInterval(() => {
    progress += 10;
    process.stdout.clearLine();
    process.stdout.cursorTo(0);
    process.stdout.write(`Updating ${packageName}... ${progress}%`);

    if (progress >= 100) {
      clearInterval(interval);
      process.stdout.write("\n");
      console.log(
        `Package \x1b[33m${packageName}\x1b[0m has been successfully updated.\n`
      );
    }
  }, 500);
}

async function updatePackages() {
  try {
    const packages = await execAsync("npm outdated -l --depth=0 --json");
    const outdatedPackages = JSON.parse(packages);
    const packagesToUpdate = Object.keys(outdatedPackages);

    if (!packagesToUpdate.length) {
      console.log("\x1b[33m%s\x1b[0m", "No packages to update!");
      return;
    } else {
      const infoPackages = createInfoPackagesToUpdate(
        outdatedPackages,
        packagesToUpdate
      );
      console.table(infoPackages);

      for (const pkg of packagesToUpdate) {
        const updateResults = await execPromise(`npm install ${pkg}@latest`);
        await updatePackageWithProgress(pkg);

        if (updateResults.stderr) {
          throw new Error(updateResults.stderr);
        }
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
}

function createInfoPackagesToUpdate(outdatedPackages, packages) {
  return packages.map((namePackage) => ({
    package: namePackage,
    type: outdatedPackages[namePackage].type,
    currentVersion: outdatedPackages[namePackage].current,
    latestVersion: outdatedPackages[namePackage].latest,
  }));
}

updatePackages();
