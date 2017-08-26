import * as fs from "fs";
import * as path from "path";
import * as mkdirp from "mkdirp";

export module FileSystemModule {

    /**
     * create a directory of neccessary
     * @param dir path to the directory
     */
    export const createDirIfNotExist = async (dir: string) =>
        new Promise((resolve, reject) => mkdirp(dir, (err) => err ? reject(err) : resolve()));

    /**
     * copies a file from one path to another
     * @param filePath file path for the file that currently exists
     * @param targetPath folder path where to copy the file to
     */
    export const copyFile = (filePath: string, targetPath: string) =>
        fs.createReadStream(filePath).pipe(fs.createWriteStream(targetPath));

    /**
     * read of file from a given path
     * @param file create a read stream of a file
     */
    export const readFileStream = (file: string) =>
        fs.createReadStream(file);

    /**
     * read a file asynchrosously
     * @param file read a file asynchronously
     */
    export const readFile = async (file: string) =>
        new Promise<string>((resolve, reject) =>
            fs.readFile(file, "utf-8", (err, data) => err ? reject(err) : resolve(data)));

    /**
     * write data to a file
     * @param file file to write to
     * @param data payload to write into the file
     */
    export const writeFile = async (file: string, data: string) =>
        new Promise((resolve, reject) =>
            fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
    
}