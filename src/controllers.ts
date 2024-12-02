import { Request, Response } from "express";
import Docker from "dockerode";
import path from "path";
import fs from "fs";
import tar from "tar-fs";
import { fileURLToPath } from "url";
import uploadCode from "./utils/uploadCode.js";

const executeCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  const docker = new Docker({ host: "127.0.0.1", port: 2375 });

  const imageName = "exeq-cpp";

  try {
    // upload the code temporarily to server
    const filePath = uploadCode(code);
    // spin off docker container
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

    const execStream = await exec.start({});
    let output = "";

    execStream.on("data", (data) => {
      output += data.toString();
    });

    execStream.on("end", async () => {
      // Cleanup: Remove the container and temporary file
      await container.stop();
      await container.remove();
      fs.unlinkSync(filePath);
      
      // Send back the execution output
      res.status(200).json({ success: true, message: output });
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

const checkExecutionStatus = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Hii check route" });
};

export const controllers = { executeCode, checkExecutionStatus };
