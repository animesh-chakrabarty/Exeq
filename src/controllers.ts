import { Request, Response } from "express";
import Docker from "dockerode";
import path from "path";
import fs from "fs";
import tar from "tar-fs";
import { fileURLToPath } from "url";
import uploadCode from "./utils/uploadCode.js";
import execute from "./utils/execute.js";

const executeCode = async (req: Request, res: Response) => {
  const { code } = req.body;
  const docker = new Docker({ host: "127.0.0.1", port: 2375 });

  const imageName = "exeq-cpp";

  try {
    // upload the code temporarily to server
    const filePath = uploadCode(code);

    // spin off docker container
    const output = await execute(imageName, filePath);

    res
      .status(200)
      .json({ success: true, message: "code execution successfull", output });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

const healthCheck = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is working fine" });
};

// const checkExecutionStatus = async (req: Request, res: Response) => {
//   res.status(200).json({ success: true, message: "Hii check route" });
// };

export const controllers = { executeCode, healthCheck };
