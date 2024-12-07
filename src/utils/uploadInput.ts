import fs from "fs";
import path from "path";

const uploadInput = (input: string) => {
    const rootDir = process.cwd();

    const dirPath = path.join(rootDir, "static");
    const filePath = path.join(dirPath, "test.input");

    if(!fs.existsSync(dirPath)) fs.mkdirSync(dirPath, {recursive: true});

    fs.writeFile(filePath, input, (err: any) => {
        if(err) throw new Error(err);
    } )

    return filePath;
}

export default uploadInput;