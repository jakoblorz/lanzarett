import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

export module FileSystemModule {

    export const createDirIfNotExist = async (dir: string) =>
        new Promise((resolve, reject) => mkdirp(dir, (err) => err ? reject(err) : resolve()));

    export const copyFile = (filePath: string, targetPath: string) =>
        fs.createReadStream(filePath).pipe(fs.createWriteStream(targetPath));

    export const readFileStream = (file: string) =>
        fs.createReadStream(file);

    export const readFile = async (file: string) =>
        new Promise((resolve, reject) =>
            fs.readFile(file, "utf-8", (err, data) => err ? reject(err) : resolve(data)));

    export const writeFile = async (file: string, data: string) =>
        new Promise((resolve, reject) =>
            fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
    
}