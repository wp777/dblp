import { FetchSubAction } from "./FetchSubAction";
import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";
import * as utils from "../../utils";

export class FetchVenuesSubAction extends FetchSubAction<dataTypes.Venues> {
    
    private venueAcronymsToFetch: string[] = [];
    private venueKeysToFetch: string[] = [];
    
    setVenueAcronymsToFetch(venueAcronymsToFetch: string[]): void {
        this.venueAcronymsToFetch = venueAcronymsToFetch;
    }
    
    setVenueKeysToFetch(venueKeysToFetch: string[]): void {
        this.venueKeysToFetch = venueKeysToFetch;
    }
    
    protected getQueryString(): string {
        return "a|b|c|d|e|f|g|h|i|j|k|l|m|n|o|p|q|r|s|t|u|v|w|x|y|z|0|1|2|3|4|5|6|7|8|9";
    }
    
    protected async fetch(queryString: string): Promise<dataTypes.Venues> {
        const venuesArray = await this.fetchAllPrimaryObjects<dblpApi.responseTypes.Venue>(dblpApi.Endpoint.SEARCH_VENUES, queryString);
        const filteredVenuesArray = venuesArray.filter(venue => {
            return this.venueAcronymsToFetch.includes(venue.acronym) || this.venueKeysToFetch.includes(dblpApi.Urls.extractVenueKeyFromVenueUrl(venue.url));
        });
        const venuesObject = utils.MapUtils.convertArrayToMap<dblpApi.responseTypes.Venue>(filteredVenuesArray, obj => dblpApi.Urls.extractVenueKeyFromVenueUrl(obj.url));
        const mappedVenuesObject = utils.MapUtils.mapObjectsInMap(venuesObject, obj => this.convertResponseVenueToDataVenue(obj));
        return mappedVenuesObject;
    }
    
    private convertResponseVenueToDataVenue(responseVenue: dblpApi.responseTypes.Venue): dataTypes.Venue {
        return {
            acronym: responseVenue.acronym,
            type: responseVenue.type,
            url: responseVenue.url,
            venue: responseVenue.venue,
        };
    }
    
}
