import { FetchSubAction } from "./FetchSubAction";
import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";
import * as utils from "../../utils";

type PublicationsAndExternalAuthors = { publications: dataTypes.Publications, externalAuthors: dataTypes.SimpleAuthors };

export class FetchPublicationsAndExternalAuthorsSubAction extends FetchSubAction<PublicationsAndExternalAuthors> {
    
    private knownAuthorPids: string[] = [];
    
    setKnownAuthorPids(knownAuthorPids: string[]): void {
        this.knownAuthorPids = knownAuthorPids;
    }
    
    protected getQueryString(): string {
        return this.configuration.authors
            .map(fullName => fullName.split(" ").pop())
            .join("|");
    }
    
    protected async fetch(queryString: string): Promise<PublicationsAndExternalAuthors> {
        const publicationsArray = await this.fetchAllPrimaryObjects<dblpApi.responseTypes.Publication>(dblpApi.Endpoint.SEARCH_PUBLICATIONS, queryString);
        const filteredPublicationsArray = publicationsArray.filter(publication => this.isPublicationByAnAuthorOnTheList(publication));
        const externalAuthors = this.getExternalAuthorsFromPublications(filteredPublicationsArray);
        const publicationsObject = utils.MapUtils.convertArrayToMap(filteredPublicationsArray, obj => obj.key);
        const mappedPublicationsObject = utils.MapUtils.mapObjectsInMap(publicationsObject, obj => this.convertResponsePublicationToDataPublication(obj));
        return {
            publications: mappedPublicationsObject,
            externalAuthors: externalAuthors,
        };
    }
    
    private isPublicationByAnAuthorOnTheList(publication: dblpApi.responseTypes.Publication): boolean {
        let authorFoundInTheList: boolean = false;
        const authors = Array.isArray(publication.authors.author) ? publication.authors.author : [publication.authors.author];
        for (let author of authors) {
            if (this.isAuthorOnTheList(author.text)) {
                authorFoundInTheList = true;
                break;
            }
        }
        return authorFoundInTheList;
    }
    
    private convertResponsePublicationToDataPublication(responsePublication: dblpApi.responseTypes.Publication): dataTypes.Publication {
        const authors = Array.isArray(responsePublication.authors.author) ? responsePublication.authors.author : [responsePublication.authors.author];
        return {
            authorPids: authors.map(author => author["@pid"]),
            doi: responsePublication.doi,
            ee: responsePublication.ee,
            key: responsePublication.key,
            pages: responsePublication.pages,
            title: responsePublication.title,
            type: responsePublication.type,
            url: responsePublication.url,
            venueAcronym: Array.isArray(responsePublication.venue) ? responsePublication.venue[0] : responsePublication.venue,
            year: responsePublication.year,
        };
    }
    
    private getExternalAuthorsFromPublications(publications: dblpApi.responseTypes.Publication[]): dataTypes.SimpleAuthors {
        const externalAuthors: dataTypes.SimpleAuthors = {};
        for (let publication of publications) {
            const authorReferences = Array.isArray(publication.authors.author) ? publication.authors.author : [publication.authors.author];
            for (let authorReference of authorReferences) {
                const authorPid = authorReference["@pid"];
                const fullAuthorName = authorReference.text;
                if (!(authorPid in externalAuthors) && !this.knownAuthorPids.includes(authorPid)) {
                    externalAuthors[authorPid] = {
                        author: fullAuthorName,
                        pid: authorPid,
                    };
                }
            }
        }
        return externalAuthors;
    }
    
}
