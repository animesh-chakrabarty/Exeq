import Docker from "dockerode";
import path from "path";
import fs from "fs";
import tar from "tar-fs";

const execute = async (imageName: string, filePath: string): Promise<string> => {
  const docker = new Docker({socketPath: '/var/run/docker.sock'});

  const container = await docker.createContainer({
    Image: imageName,
    Tty: true,
  });
  await container.start();

  const tarStream = tar.pack(path.dirname(filePath), {
    entries: [path.basename(filePath)],
  });
  await container.putArchive(tarStream, { path: "/app/" });

  const exec = await container.exec({
    Cmd: ["bash", "-c", `g++ /app/test.cpp -o /app/output && /app/output`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>(async (resolve, reject) => {
    try {
      const execStream = await exec.start({});
      let output = "";

      execStream.on("data", (data) => {
        output +=  data.toString().replace(/[^\x20-\x7E]/g, "");
      });

      execStream.on("end", async () => {
        // Cleanup: Remove the container and temporary file
        await container.stop();
        await container.remove();
        fs.unlinkSync(filePath);

        resolve(output); // Resolve the promise with the output
      });

      execStream.on("error", (err) => {
        reject(err); // Reject the promise if an error occurs
      });
    } catch (err) {
      // Handle any errors in the promise
      reject(err);
    }
  });
};

export default execute;
