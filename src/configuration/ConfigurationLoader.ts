import * as fs from "fs";
import { Configuration } from "./Configuration";
import { defaultConfiguration } from "./defaultConfiguration";

export class ConfigurationLoader {
    
    static load(filePath: string | null = null): Configuration {
        if (filePath !== null) {
            return this.loadFromFile(filePath);
        }
        else {
            return this.loadDefault();
        }
    }
    
    static loadFromFile(filePath: string): Configuration {
        if (!fs.existsSync(filePath)) {
            throw new Error(`Configuration file doesn't exist: "${filePath}".`);
        }
        const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
        const configurationFromFile = JSON.parse(fileContent) as Configuration;
        return {
            ...this.getClonedDefaultConfiguration(),
            ...configurationFromFile,
        };
    }
    
    static loadDefault(): Configuration {
        return { ...this.getClonedDefaultConfiguration() };
    }
    
    private static getClonedDefaultConfiguration(): Configuration {
        return JSON.parse(JSON.stringify(defaultConfiguration));
    }
    
}
