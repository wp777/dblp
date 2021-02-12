import { Action } from "../Action";
import * as dataTypes from "../../dataTypes";
import * as filters from "../filters";

export class GetAllDataAction extends Action {
    
    async run(): Promise<void> {
        const cacheEntryExists = await this.cache.exists(this.configuration.cacheKey);
        if (!cacheEntryExists) {
            throw new Error("Cache doesn't exist. Run fetch action first.");
        }
        const cachedDataStr = await this.cache.read(this.configuration.cacheKey);
        const data: dataTypes.Data = JSON.parse(cachedDataStr);
        filters.PublicationFilters.applyFiltersFromConfiguration(data.publications, this.configuration);
        const dataStr = JSON.stringify(data);
        console.log(dataStr);
    }
    
}
