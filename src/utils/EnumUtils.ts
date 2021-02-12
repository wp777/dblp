export class EnumUtils {
    
    static getKeys<T extends object, K extends keyof T>(obj: T): K[] {
        return Object.keys(obj).filter(k => Number.isNaN(+k)) as K[];
    }
    
}
