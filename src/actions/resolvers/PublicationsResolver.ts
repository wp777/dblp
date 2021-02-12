import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";

export class PublicationsResolver {
    
    static resolvePublication(publication: dataTypes.Publication, data: dataTypes.Data): dataTypes.ResolvedPublication {
        return {
            authors: this.getAuthorsFromPublication(publication, data),
            doi: publication.doi,
            ee: publication.ee,
            key: publication.key,
            pages: publication.pages,
            title: publication.title,
            type: publication.type,
            url: publication.url,
            venue: this.getVenueFromPublication(publication, data),
            year: publication.year,
        };
    }
    
    private static getAuthorsFromPublication(publication: dataTypes.Publication, data: dataTypes.Data): dataTypes.SimpleAuthor[] {
        const knownAuthors = data.authors;
        const externalAuthors = data.externalAuthors;
        
        const authors: dataTypes.SimpleAuthor[] = [];
        for (let authorPid of publication.authorPids) {
            if (authorPid in knownAuthors) {
                authors.push({
                    author: knownAuthors[authorPid].author,
                    pid: authorPid,
                });
            }
            else if (authorPid in externalAuthors) {
                authors.push({
                    author: externalAuthors[authorPid].author,
                    pid: authorPid,
                });
            }
            else {
                throw new Error(`Author doesn't exist: "${authorPid}".`);
            }
        }
        return authors;
    }
    
    private static getVenueFromPublication(publication: dataTypes.Publication, data: dataTypes.Data): dataTypes.Venue | string {
        const venueKey = dblpApi.Urls.extractVenueKeyFromPublicationUrl(publication.url);
        return data.venues[venueKey] ?? publication.venueAcronym;
    }
    
}
