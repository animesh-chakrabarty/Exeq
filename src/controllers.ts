import { Request, Response } from "express";
import uploadCode from "./utils/uploadCode.js";
import execute from "./utils/execute.js";
import uploadInput from "./utils/uploadInput.js";

const executeCode = async (req: Request, res: Response) => {
  const { code, input } = req.body;
  const imageName = "exeq-cpp";

  try {
    // Upload the code temporarily to server
    const codeFilePath = uploadCode(code);

    // Upload the inputs temporarily to server
    const inputFilePath = uploadInput(input);

    // Execute code
    const output = await execute(imageName, codeFilePath, inputFilePath);

    res
      .status(200)
      .json({ success: true, message: "code execution successfull", output });
  } catch (err) {
    res.status(500).json({ success: false, message: err });
  }
};

const healthCheck = async (req: Request, res: Response) => {
  res.status(200).json({ success: true, message: "Server is up & running" });
};

export const controllers = { executeCode, healthCheck };
