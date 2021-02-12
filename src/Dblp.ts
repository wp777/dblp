import * as actions from "./actions";
import * as cache from "./cache";
import * as commandLine from "./commandLine";
import * as configuration from "./configuration";


export class Dblp {
    
    private static readonly CACHE_PATH: string = "cache";
    
    private cache: cache.Cache;
    private configuration: configuration.Configuration;
    private actionName: actions.ActionName;
    
    constructor() {
        this.cache = new cache.FileCache(Dblp.CACHE_PATH);
        
        const argsReader = new commandLine.ArgsReader();
        argsReader.read(process.argv);
        
        const configurationFile = argsReader.getString(commandLine.Arg.CONFIGURATION_FILE);
        this.configuration = configuration.ConfigurationLoader.load(configurationFile);
        
        const action = argsReader.getString(commandLine.Arg.ACTION, actions.ActionName.FETCH);
        this.actionName = actions.Actions.getActionNameFromString(action);
    }
    
    async run(): Promise<void> {
        const action = actions.Actions.getAction(this.actionName, this.cache, this.configuration);
        await action.run();
    }
    
}
