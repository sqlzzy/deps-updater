function updatePackageWithProgress(packageName) {
  return new Promise((resolve) => {
    let progress = 0;

    const interval = setInterval(() => {
      progress += 10;
      process.stdout.clearLine();
      process.stdout.cursorTo(0);
      process.stdout.write(`Updating ${packageName}... ${progress}%`);

      if (progress == 100) {
        clearInterval(interval);
        process.stdout.write("\n");
        console.log(
          `Package \x1b[33m${packageName}\x1b[0m has been successfully updated.\n`
        );
        resolve(`Package ${packageName} has been successfully updated.`);
      }
    }, 100);
  });
}

function createInfoPackagesToUpdate(outdatedPackages, packages) {
  return packages.map((namePackage) => ({
    package: namePackage,
    type: outdatedPackages[namePackage].type,
    currentVersion: outdatedPackages[namePackage].current,
    latestVersion: outdatedPackages[namePackage].latest,
  }));
}

export { updatePackageWithProgress, createInfoPackagesToUpdate };
