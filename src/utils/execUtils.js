import { exec } from "child_process";

const execAsync = (command) => {
  return new Promise(function (resolve, reject) {
    exec(command, (error, stdout, stderr) => {
      if (stderr !== "") {
        reject(stderr);
      } else {
        resolve(stdout);
      }
    });
  });
};

export default execAsync;
