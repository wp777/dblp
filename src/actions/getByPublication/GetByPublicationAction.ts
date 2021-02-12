import { Action } from "../Action";
import { DataByPublication } from "./DataByPublication";
import * as dataTypes from "../../dataTypes";
import * as resolvers from "../resolvers";
import * as filters from "../filters";

export class GetByPublicationAction extends Action {
    
    async run(): Promise<void> {
        const cacheEntryExists = await this.cache.exists(this.configuration.cacheKey);
        if (!cacheEntryExists) {
            throw new Error("Cache doesn't exist. Run fetch action first.");
        }
        const cachedDataStr = await this.cache.read(this.configuration.cacheKey);
        const cachedData = JSON.parse(cachedDataStr);
        filters.PublicationFilters.applyFiltersFromConfiguration(cachedData.publications, this.configuration);
        const dataByAuthor = this.convertDataToDataByPublication(cachedData);
        const dataByAuthorStr = JSON.stringify(dataByAuthor);
        console.log(dataByAuthorStr);
    }
    
    private convertDataToDataByPublication(data: dataTypes.Data): DataByPublication {
        const dataByPublication: DataByPublication = {};
        for (let publicationKey in data.publications) {
            const publication = data.publications[publicationKey];
            dataByPublication[publicationKey] = resolvers.PublicationsResolver.resolvePublication(publication, data);
        }
        return dataByPublication;
    }
    
}
