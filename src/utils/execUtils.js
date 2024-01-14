import { exec } from "child_process";

const execAsync = (command) => {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (stdout && stderr === "") {
        resolve(stdout);
      } else if (error) {
        reject(error);
      }
    });
  });
};

export default execAsync;
