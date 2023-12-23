import updatePackages from "../packageUpdater.js";
import execAsync from "../../utils/execUtils.js";
import {
  createInfoPackagesToUpdate,
  updatePackageWithProgress,
} from "../../utils/packageUtils";

jest.mock("../../utils/execUtils.js");
jest.mock("../../utils/packageUtils.js");

describe("updatePackages", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should log message if there are no packages to update", async () => {
    execAsync.mockResolvedValue("{}");
    const consoleSpy = jest.spyOn(console, "log");

    await updatePackages();

    expect(consoleSpy).toHaveBeenCalledWith(
      "\x1b[33m%s\x1b[0m",
      "No packages to update!"
    );
  });

  it("should update packages and log progress", async () => {
    execAsync.mockResolvedValue('{"package1": "1.0.0", "package2": "2.0.0"}');
    createInfoPackagesToUpdate.mockReturnValue([
      { package: "package1", type: "dependencies", currentVersion: "1.0.0" },
      { package: "package2", type: "devDependencies", currentVersion: "2.0.0" },
    ]);

    await updatePackages();

    expect(execAsync).toHaveBeenCalledWith("npm outdated -l --depth=0 --json");
    expect(createInfoPackagesToUpdate).toHaveBeenCalledWith(
      { package1: "1.0.0", package2: "2.0.0" },
      ["package1", "package2"]
    );
    expect(execAsync).toHaveBeenCalledWith("npm install package1@latest");
    expect(updatePackageWithProgress).toHaveBeenCalledWith("package1");
    expect(execAsync).toHaveBeenCalledWith("npm install package2@latest");
    expect(updatePackageWithProgress).toHaveBeenCalledWith("package2");
  });

  it("should handle errors", async () => {
    execAsync.mockRejectedValue("Failed to fetch outdated packages");

    const consoleErrorSpy = jest.spyOn(console, "error");

    await updatePackages();

    expect(consoleErrorSpy).toHaveBeenCalledWith(
      "An error occurred:",
      "Failed to fetch outdated packages"
    );
  });
});
