import { Action } from "../Action";
import { DataByAuthor } from "./DataByAuthor";
import * as dataTypes from "../../dataTypes";
import * as resolvers from "../resolvers";
import * as filters from "../filters";

export class GetByAuthorAction extends Action {
    
    private data: dataTypes.Data | null = null;
    
    async run(): Promise<void> {
        const cacheEntryExists = await this.cache.exists(this.configuration.cacheKey);
        if (!cacheEntryExists) {
            throw new Error("Cache doesn't exist. Run fetch action first.");
        }
        const cachedDataStr = await this.cache.read(this.configuration.cacheKey);
        const cachedData = JSON.parse(cachedDataStr);
        filters.PublicationFilters.applyFiltersFromConfiguration(cachedData.publications, this.configuration);
        this.data = cachedData;
        const dataByAuthor = this.convertDataToDataByAuthor(cachedData);
        const dataByAuthorStr = JSON.stringify(dataByAuthor);
        console.log(dataByAuthorStr);
    }
    
    private convertDataToDataByAuthor(data: dataTypes.Data): DataByAuthor {
        const dataByAuthor: DataByAuthor = {};
        for (let authorPid in data.authors) {
            const author = data.authors[authorPid];
            dataByAuthor[authorPid] = {
                ...author,
                publications: this.getPublicationsByAuthorPid(authorPid),
            };
        }
        return dataByAuthor;
    }
    
    private getPublicationsByAuthorPid(authorPid: string): dataTypes.ResolvedPublication[] {
        const publications: dataTypes.ResolvedPublication[] = [];
        for (let publicationKey in this.data!.publications) {
            const publication = this.data!.publications[publicationKey];
            if (publication.authorPids.includes(authorPid)) {
                publications.push(resolvers.PublicationsResolver.resolvePublication(publication, this.data!));
            }
        }
        return publications;
    }
    
}
