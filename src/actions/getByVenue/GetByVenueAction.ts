import { Action } from "../Action";
import { DataByVenue } from "./DataByVenue";
import * as dataTypes from "../../dataTypes";
import * as resolvers from "../resolvers";
import * as filters from "../filters";

export class GetByVenueAction extends Action {
    
    async run(): Promise<void> {
        const cacheEntryExists = await this.cache.exists(this.configuration.cacheKey);
        if (!cacheEntryExists) {
            throw new Error("Cache doesn't exist. Run fetch action first.");
        }
        const cachedDataStr = await this.cache.read(this.configuration.cacheKey);
        const cachedData = JSON.parse(cachedDataStr);
        filters.PublicationFilters.applyFiltersFromConfiguration(cachedData.publications, this.configuration);
        const dataByAuthor = this.convertDataToDataByVenue(cachedData);
        const dataByAuthorStr = JSON.stringify(dataByAuthor);
        console.log(dataByAuthorStr);
    }
    
    private convertDataToDataByVenue(data: dataTypes.Data): DataByVenue {
        const dataByVenue: DataByVenue = {};
        for (let venueKey in data.venues) {
            const venue = data.venues[venueKey];
            dataByVenue[venueKey] = resolvers.VenuesResolver.resolveVenue(venue, data);
        }
        return dataByVenue;
    }
    
}
