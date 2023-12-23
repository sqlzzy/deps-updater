import { createInfoPackagesToUpdate } from "../packageUtils.js";

describe("createInfoPackagesToUpdate", () => {
  it("should create package info", () => {
    const outdatedPackages = {
      package1: { type: "prod", current: "1.0.0", latest: "1.2.0" },
      package2: { type: "dev", current: "2.1.0", latest: "2.3.0" },
    };
    const packages = ["package1", "package2"];

    const expectedInfo = [
      {
        package: "package1",
        type: "prod",
        currentVersion: "1.0.0",
        latestVersion: "1.2.0",
      },
      {
        package: "package2",
        type: "dev",
        currentVersion: "2.1.0",
        latestVersion: "2.3.0",
      },
    ];

    expect(createInfoPackagesToUpdate(outdatedPackages, packages)).toEqual(
      expectedInfo
    );
  });

  it("should handle empty packages", () => {
    const outdatedPackages = {
      package1: { type: "prod", current: "1.0.0", latest: "1.2.0" },
      package2: { type: "dev", current: "2.1.0", latest: "2.3.0" },
    };
    const packages = [];

    const expectedInfo = [];

    expect(createInfoPackagesToUpdate(outdatedPackages, packages)).toEqual(
      expectedInfo
    );
  });
});
