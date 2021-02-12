import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";
import { PublicationsResolver } from "./PublicationsResolver";

export class VenuesResolver {
    
    static resolveVenue(venue: dataTypes.Venue, data: dataTypes.Data): dataTypes.ResolvedVenue {
        const publications = this.getPublicationsFromVenue(venue, data);
        return {
            authors: this.getAuthorsFromPublications(publications, data),
            publications: publications,
            venue: venue,
        };
    }
    
    private static getPublicationsFromVenue(venue: dataTypes.Venue, data: dataTypes.Data): dataTypes.ResolvedPublication[] {
        const publications: dataTypes.ResolvedPublication[] = [];
        const venueKey = dblpApi.Urls.extractVenueKeyFromVenueUrl(venue.url);
        for (let publicationKey in data.publications) {
            const publication = data.publications[publicationKey];
            const publicationVenueKey = dblpApi.Urls.extractVenueKeyFromPublicationUrl(publication.url);
            if (publicationVenueKey == venueKey) {
                const resolvedPublication = PublicationsResolver.resolvePublication(publication, data);
                publications.push(resolvedPublication);
            }
        }
        return publications;
    }
    
    private static getAuthorsFromPublications(publications: dataTypes.ResolvedPublication[], data: dataTypes.Data): dataTypes.SimpleAuthor[] {
        const authors: dataTypes.SimpleAuthor[] = [];
        for (let publication of publications) {
            for (let author of publication.authors) {
                if (!authors.find(_author => _author.pid == author.pid)) {
                    authors.push(author);
                }
            }
        }
        return authors;
    }
    
}
