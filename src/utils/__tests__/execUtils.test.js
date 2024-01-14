import execAsync from "../execUtils.js";

jest.mock("child_process", () => ({
  exec: jest.fn(),
}));

describe("execAsync function", () => {
  it("should resolve with stdout when the command is executed successfully", async () => {
    const mockStdout = "Mocked standard output";
    require("child_process").exec.mockImplementationOnce(
      (command, callback) => {
        callback(null, mockStdout, "");
      }
    );

    const result = await execAsync("your command");
    expect(result).toBe(mockStdout);
  });

  it("should reject with stderr when the command execution fails", async () => {
    const mockStderr = "Mocked standard error";
    require("child_process").exec.mockImplementationOnce(
      (command, callback) => {
        callback(null, "", mockStderr);
      }
    );

    await expect(execAsync("your command")).rejects.toMatch(mockStderr);
  });
});
