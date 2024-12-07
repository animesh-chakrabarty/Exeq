import Docker from "dockerode";
import path from "path";
import fs from "fs";
import tar from "tar-fs";

const execute = async (imageName: string, codeFilePath: string, inputFilePath: string): Promise<string> => {
  const docker = new Docker({socketPath: '/var/run/docker.sock'});

  const container = await docker.createContainer({
    Image: imageName,
    Tty: true,
  });
  await container.start();

  const tarStream = tar.pack(path.dirname(codeFilePath), {
    entries: [path.basename(codeFilePath), path.basename(inputFilePath)],
  });
  await container.putArchive(tarStream, { path: "/app/" });

  const exec = await container.exec({
    Cmd: ["bash", "-c", `g++ /app/test.cpp -o /app/output && /app/output < /app/test.input`],
    AttachStdout: true,
    AttachStderr: true,
  });

  return new Promise<string>(async (resolve, reject) => {
    try {
      const execStream = await exec.start({});
      let output = "";

      execStream.on("data", (data) => {
        output +=  data.toString();
      });

      execStream.on("end", async () => {
        await container.stop();
        await container.remove();
        fs.unlinkSync(codeFilePath);
        fs.unlinkSync(inputFilePath);
        resolve(output); 
      });

      execStream.on("error", (err) => {
        reject(err); 
      });
    } catch (err) {
      reject(err);
    }
  });
};

export default execute;
