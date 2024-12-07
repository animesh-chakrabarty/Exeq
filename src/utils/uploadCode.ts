import path from "path";
import fs from "fs";

const uploadCode = (code: any) => {
  const rootDir = process.cwd();

  const dirPath = path.join(rootDir, "static");
  const filePath = path.join(dirPath, "test.cpp");

  if (!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, { recursive: true });

  fs.writeFile(filePath, code, (err) => {
    if (err) throw new Error(err.message);
  });

  return filePath;
};

export default uploadCode;
