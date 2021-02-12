export abstract class Cache {
    
    abstract exists(key: string): Promise<boolean>;
    abstract write(key: string, data: string): Promise<void>;
    abstract read(key: string): Promise<string>;
    
}
