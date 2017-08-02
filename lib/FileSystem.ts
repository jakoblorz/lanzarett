import * as fs from "fs";
import * as mkdirp from "mkdirp";
import * as path from "path";
import * as rmrf from "rimraf";

export class FileSystem {
    
    /**
     * read a file encoded in utf-8
     * @param file string pointing to a file
     */
    public static async readFile(file: string) {
        return new Promise<string>((resolve, reject) => 
            fs.exists(file, (exists) => exists ?
                (fs.readFile(file, "utf-8", (err, data) => err ? reject(err) : resolve(data))) : resolve("")));
    }
    
    /**
     * write to a file
     * @param file string pointing to a file
     * @param data content to write to a file
     */
    public static async writeFile(file: string, data: string) {
        return new Promise<void>((resolve, reject) =>
            fs.writeFile(file, data, (err) => err ? reject(err) : resolve()));
    }
    
    /**
     * create all necessary directories if they do not exist
     * @param dir path to create
     */
    public static async createDirectory(dir: string) {
        return new Promise<void>((resolve, reject) => mkdirp(dir, (err) => err ? reject(err) : resolve()));
    }

    /**
     * removes all subfolders/files and finally the given folder
     * @param dir path to folder to remove
     */
    public static async removeDirectory(dir: string) {
        return new Promise<void>((resolve, reject) => fs.exists(dir, (exists) =>
            exists ? (rmrf(dir, (err) => err ? reject(err) : resolve())) : resolve()));
    }
    
    /**
     * get all files recursive of the given folder
     * @param dir path to a folder
     */
    public static getFileList(dir: string) {
        const recurseDirectory = (prev: string[], curr: string) => {
            Array.prototype.push.apply(prev, FileSystem.getFileList(path.join(dir, curr)));
            return prev;
        };

        return fs.readdirSync(dir).reduce<string[]>((prev, curr) => {
            if (fs.statSync(path.join(dir, curr)).isDirectory()) {
                prev = recurseDirectory(prev, curr);
            } else {
                prev.push(path.join(dir, curr));
            }
            return prev;
        }, []);
    }
}