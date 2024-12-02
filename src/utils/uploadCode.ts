import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";

const uploadCode = (code: any) => {
  const __dirname = process.cwd();

  const dirPath = path.join(__dirname, "codes");
  const filePath = path.join(dirPath, "test.cpp");

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  fs.writeFile(filePath, code, (err) => {
    if (err) throw new Error(err.message);
  });

  return filePath;
};

export default uploadCode;
