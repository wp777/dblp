import { FetchSubAction } from "./FetchSubAction";
import * as dataTypes from "../../dataTypes";
import * as dblpApi from "../../dblpApi";
import * as utils from "../../utils";

export class FetchAuthorsSubAction extends FetchSubAction<dataTypes.Authors> {
    
    protected getQueryString(): string {
        return this.configuration.authors
            .map(fullName => fullName.split(" ").pop())
            .join("|");
    }
    
    protected async fetch(queryString: string): Promise<dataTypes.Authors> {
        const authorsArray = await this.fetchAllPrimaryObjects<dblpApi.responseTypes.Author>(dblpApi.Endpoint.SEARCH_AUTHORS, queryString);
        const filteredAuthorsArray = authorsArray.filter(author => this.isAuthorOnTheList(author.author));
        const authorsObject = utils.MapUtils.convertArrayToMap(filteredAuthorsArray, obj => dblpApi.Urls.extractAuthorPidFromAuthorUrl(obj.url));
        const mappedAuthorsObject = utils.MapUtils.mapObjectsInMap(authorsObject, obj => this.convertResponseAuthorToDataAuthor(obj));
        return mappedAuthorsObject;
    }
    
    private convertResponseAuthorToDataAuthor(responseAuthor: dblpApi.responseTypes.Author): dataTypes.Author {
        return {
            author: responseAuthor.author,
            url: responseAuthor.url,
        };
    }
    
}
