import { Cache } from "./Cache";
import * as fs from "fs";
import * as path from "path";

export class FileCache extends Cache {
    
    private path: string;
    
    constructor(path: string) {
        super();
        this.path = path;
    }
    
    async exists(key: string): Promise<boolean> {
        const filePath = this.getFilePath(key);
        return fs.existsSync(filePath);
    }
    
    async write(key: string, data: string): Promise<void> {
        const filePath = this.getFilePath(key);
        fs.writeFileSync(filePath, data, { encoding: "utf-8" });
    }
    
    async read(key: string): Promise<string> {
        const filePath = this.getFilePath(key);
        const data = fs.readFileSync(filePath, { encoding: "utf-8" });
        return data;
    }
    
    private getFilePath(key: string): string {
        return path.join(this.path, `${key}.txt`);
    }
    
}