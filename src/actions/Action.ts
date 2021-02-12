import * as cache from "../cache";
import * as configuration from "../configuration";

export abstract class Action {
    
    cache: cache.Cache;
    configuration: configuration.Configuration;
    
    constructor(cache: cache.Cache, configuration: configuration.Configuration) {
        this.cache = cache;
        this.configuration = configuration;
    }
    
    abstract run(): Promise<void>;
    
}
