import { Action } from "../Action";
import { FetchAuthorsSubAction } from "./FetchAuthorsSubAction";
import { FetchPublicationsAndExternalAuthorsSubAction } from "./FetchPublicationsAndExternalAuthorsSubAction";
import { FetchVenuesSubAction } from "./FetchVenuesSubAction";
import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";

export class FetchAction extends Action {
    
    private fetchedData: dataTypes.Data | null = null;
    
    async run(): Promise<void> {
        const fetchAuthorsSubAction = new FetchAuthorsSubAction(this.cache, this.configuration);
        const fetchedAuthors = await fetchAuthorsSubAction.runAndGetResult();
        
        const fetchPublicationsAndExternalAuthorsSubAction = new FetchPublicationsAndExternalAuthorsSubAction(this.cache, this.configuration);
        fetchPublicationsAndExternalAuthorsSubAction.setKnownAuthorPids(Object.keys(fetchedAuthors));
        const { publications: fetchedPublications, externalAuthors: fetchedExternalAuthors } = await fetchPublicationsAndExternalAuthorsSubAction.runAndGetResult();
        
        const fetchVenuesSubAction = new FetchVenuesSubAction(this.cache, this.configuration);
        const venuesAcronyms = this.getVenueAcronymsFromPublications(fetchedPublications);
        const venueKeys = this.getVenueKeysFromPublications(fetchedPublications);
        fetchVenuesSubAction.setVenueAcronymsToFetch(venuesAcronyms);
        fetchVenuesSubAction.setVenueKeysToFetch(venueKeys);
        const fetchedVenues = await fetchVenuesSubAction.runAndGetResult();
        
        this.fetchedData = {
            authors: fetchedAuthors,
            externalAuthors: fetchedExternalAuthors,
            publications: fetchedPublications,
            venues: fetchedVenues,
        };
        
        await this.cache.write(this.configuration.cacheKey, JSON.stringify(this.fetchedData));
    }
    
    private getVenueAcronymsFromPublications(publications: dataTypes.Publications): string[] {
        const venueAcronyms: string[] = [];
        for (let publicationId in publications) {
            const publication = publications[publicationId];
            if (!venueAcronyms.includes(publication.venueAcronym)) {
                venueAcronyms.push(publication.venueAcronym);
            }
        }
        return venueAcronyms;
    }
    
    private getVenueKeysFromPublications(publications: dataTypes.Publications): string[] {
        const venueKeys: string[] = [];
        for (let publicationId in publications) {
            const publication = publications[publicationId];
            const venueKey = dblpApi.Urls.extractVenueKeyFromPublicationUrl(publication.url);
            if (!venueKeys.includes(venueKey)) {
                venueKeys.push(venueKey);
            }
        }
        return venueKeys;
    }
    
}
