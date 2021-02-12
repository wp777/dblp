import { QueryUrlBuilder } from "./QueryUrlBuilder";
import * as responseTypes from "./responseTypes";
import * as https from "https";

export class PaginatedQuery {
    
    private static readonly MAX_NUMBER_OF_RETRIES: number = 5;
    
    private queryUrlBuilder: QueryUrlBuilder;
    
    constructor(queryUrlBuilder: QueryUrlBuilder) {
        this.queryUrlBuilder = queryUrlBuilder;
    }
    
    async fetchAllPages<T extends responseTypes.Response<responseTypes.ResponsePrimaryObject>>(): Promise<T[]> {
        const firstPage = await this.fetchPage<T>(0);
        const numHits = parseInt(firstPage.result.hits["@total"]);
        const pageSize = this.queryUrlBuilder.getPageSize();
        const numberOfPages = Math.ceil(numHits / pageSize);
        
        const allPages: T[] = [];
        allPages.push(firstPage);
        for (let pageId = 1; pageId <= numberOfPages; ++pageId) {
            const page = await this.fetchPage<T>(pageId);
            allPages.push(page);
        }
        
        return allPages;
    }
    
    private async fetchPage<T extends responseTypes.Response<responseTypes.ResponsePrimaryObject>>(pageId: number): Promise<T> {
        this.queryUrlBuilder.setResultsPageId(pageId);
        const page = await this.fetchWithRetrying<T>();
        return page;
    }
    
    private async fetchWithRetrying<T extends responseTypes.Response<responseTypes.ResponsePrimaryObject>>(attemptId: number = 0): Promise<T> {
        if (attemptId > PaginatedQuery.MAX_NUMBER_OF_RETRIES) {
            throw new Error(`Unable to fetch from DBLP. Number of failed attempts: ${PaginatedQuery.MAX_NUMBER_OF_RETRIES}.`);
        }
        try {
            const result = this.tryFetch<T>();
            return result
        }
        catch {
            return this.fetchWithRetrying<T>(attemptId + 1);
        }
    }
    
    private async tryFetch<T extends responseTypes.Response<responseTypes.ResponsePrimaryObject>>(): Promise<T> {
        const url = this.queryUrlBuilder.getUrlString();
        const responseStr =  await this.performHttpsRequest(url);
        const response: T = JSON.parse(responseStr);
        if (response.result.status["@code"] != "200") {
            throw new Error(`Failed to fetch from DBLP. JSON response status code: ${response.result.status["@code"]}.`);
        }
        return response;
    }
    
    private async performHttpsRequest(url: string): Promise<string> {
        let responseStr = "";
        await new Promise<void>((resolve, reject) => {
            const request = https.get(
                url,
                result => {
                    if (result.statusCode !== 200) {
                        console.log(url)
                        reject(`HTTPS request failed. Response status code: ${result.statusCode}.`);
                    }
                    result.on("data", data => {
                        responseStr += data;
                    });
                    result.on("close", () => resolve());
                },
            );
            request.on("error", error => {
                reject(`HTTPS request failed. Response error: ${error.message}.`);
            });
        });
        return responseStr;
    }
    
}
