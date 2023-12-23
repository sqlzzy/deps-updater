import execAsync from "../utils/execUtils.js";
import {
  createInfoPackagesToUpdate,
  updatePackageWithProgress,
} from "../utils/packageUtils.js";

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
        const updateResults = await execAsync(`npm install ${pkg}@latest`);
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

export default updatePackages;
