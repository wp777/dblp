import { Action } from "../Action";
import * as dblpApi from "../../dblpApi";

export abstract class FetchSubAction<T> extends Action {
    
    protected fetchedData: T | null = null;
    
    async run(): Promise<void> {
        const queryString = this.getQueryString();
        this.fetchedData = await this.fetch(queryString);
    }
    
    async runAndGetResult(): Promise<T> {
        await this.run();
        if (!this.fetchedData) {
            throw new Error("Failed to fetch data.");
        }
        return this.fetchedData;
    }
    
    protected abstract getQueryString(): string;
    
    protected abstract fetch(queryString: string): Promise<T>;
    
    protected async fetchAllPrimaryObjects<T extends dblpApi.responseTypes.ResponsePrimaryObject>(endpoint: dblpApi.Endpoint, queryString: string): Promise<T[]> {
        const allPages = await this.fetchAllPages<dblpApi.responseTypes.Response<T>>(endpoint, queryString);
        const allPrimaryObjects: T[] = [];
        for (let page of allPages) {
            const hits = page?.result?.hits?.hit || [];
            for (let hit of hits) {
                if (hit.info) {
                    allPrimaryObjects.push(hit.info);
                }
            }
        }
        return allPrimaryObjects;
    }
    
    protected async fetchAllPages<T extends dblpApi.responseTypes.Response<dblpApi.responseTypes.ResponsePrimaryObject>>(endpoint: dblpApi.Endpoint, queryString: string): Promise<T[]> {
        const queryUrlBuilder = new dblpApi.QueryUrlBuilder(this.configuration.apiUrl, endpoint);
        queryUrlBuilder.setQueryString(queryString);
        const paginatedQuery = new dblpApi.PaginatedQuery(queryUrlBuilder);
        const allPages = await paginatedQuery.fetchAllPages<T>();
        return allPages;
    }
    
    protected isAuthorOnTheList(fullName: string): boolean {
        return this.configuration.authors.includes(fullName);
    }
    
}
