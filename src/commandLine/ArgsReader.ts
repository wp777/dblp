import * as utils from "../utils";
import { Arg } from "./Arg";
import { RawArg } from "./RawArg";
import { RawArgs } from "./RawArgs";

export class ArgsReader {
    
    private rawArgs: RawArgs = {};
    
    constructor() {
    }
    
    getBoolean(argName: string, defaultValue: boolean | null = null): boolean | null {
        if (!(argName in this.rawArgs)) {
            return defaultValue;
        }
        const value = this.rawArgs[argName].value;
        if (typeof(value) !== "boolean") {
            throw new Error(`Wrong type of argument "${argName}": "${typeof(value)} (expected "boolean").`);
        }
        return value;
    }
    
    getNumber(argName: string, defaultValue: number | null = null): number | null {
        if (!(argName in this.rawArgs)) {
            return defaultValue;
        }
        const strValue = this.rawArgs[argName].value;
        if (typeof(strValue) !== "string") {
            throw new Error(`Wrong type of argument "${argName}": "${typeof(strValue)} (expected "number").`);
        }
        const value = utils.NumberUtils.canConvertStringToNumber(strValue) ? utils.NumberUtils.convertStringToNumber(strValue) : null;
        if (typeof(value) !== "number") {
            throw new Error(`Wrong type of argument "${argName}": "${typeof(value)} (expected "number").`);
        }
        return value;
    }
    
    getString(argName: string, defaultValue: string | null = null): string | null {
        if (!(argName in this.rawArgs)) {
            return defaultValue;
        }
        const value = this.rawArgs[argName].value;
        if (typeof(value) !== "string") {
            throw new Error(`Wrong type of argument "${argName}": "${typeof(value)} (expected "string").`);
        }
        return value;
    }
    
    read(processArgv: string[]): void {
        let args = this.filterOutNodeStartupArgs(processArgv);
        args = this.joinSpaceSeparatedParts(args);
        
        const knownArgNames = Object.values(Arg) as string[];
        
        const rawArgs: RawArgs = {};
        for (let arg of args) {
            if (!arg.startsWith("-")) {
                throw new Error(`Unrecognized argument: "${arg}".`)
            }
            const rawArg = this.parseArg(arg);
            if ((rawArg.name in rawArgs) && rawArgs[rawArg.name].value != rawArg.value) {
                throw new Error(`Trying to redeclare command line argument "${rawArg.name}". Previous value: "${rawArgs[rawArg.name].value}". New value: "${rawArg.value}".`);
            }
            if (knownArgNames.indexOf(rawArg.name) < 0) {
                throw new Error(`Unknown argument: "${rawArg.name}".`);
            }
            rawArgs[rawArg.name] = rawArg;
        }
        this.rawArgs = rawArgs;
    }
    
    private filterOutNodeStartupArgs(processArgv: string[]): string[] {
        return processArgv.slice(2);
    }
    
    private joinSpaceSeparatedParts(args: string[]): string[] {
        const newArgs: string[] = [];
        for (let i = 0; i < args.length; ++i) {
            const arg = args[i];
            if (arg.startsWith("-")) {
                newArgs.push(arg);
            }
            else if (newArgs.length > 0) {
                this.appendLastArg(newArgs, arg);
            }
        }
        return newArgs;
    }
    
    private appendLastArg(args: string[], arg: string): void {
        const idx = args.length - 1;
        if (!args[idx].endsWith("=") && !arg.startsWith("=")) {
            args[idx] += "=";
        }
        args[idx] += arg;
    }
    
    private parseArg(arg: string): RawArg {
        if (arg.includes("=")) {
            return this.parseValueArg(arg);
        }
        else {
            return this.parseFlagArg(arg);
        }
    }
    
    private parseValueArg(arg: string): RawArg {
        const eqIdx = arg.indexOf("=");
        const argName = this.stripArgNamePrefix(arg.substr(0, eqIdx));
        const argValue = arg.substr(eqIdx + 1);
        return {
            name: argName,
            value: argValue,
        };
    }
    
    private parseFlagArg(arg: string): RawArg {
        return {
            name: this.stripArgNamePrefix(arg),
            value: true,
        };
    }
    
    private stripArgNamePrefix(argName: string): string {
        while (argName.startsWith("-")) {
            argName = argName.substr(1);
        }
        return argName;
    }
    
}
