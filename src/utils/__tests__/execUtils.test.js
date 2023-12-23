import execAsync from "../execUtils.js";

describe("execAsync", () => {
  it("should resolve with stdout and stderr when the command is successful", async () => {
    const result = await execAsync("ls");
    expect(result.stdout).toBeDefined();
    expect(result.stderr).toBe("");
  });

  it("should reject with an error when the command fails", async () => {
    await expect(execAsync("unknown-command")).rejects.toThrow();
  });
});
