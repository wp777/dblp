import { Endpoint } from "./Endpoint";

export enum ResponseFormat {
    json = "json",
    jsonp = "jsonp",
    xml = "xml",
}

export class QueryUrlBuilder {
    
    private static readonly PARAM_QUERY_STRING: string = "q";
    private static readonly PARAM_RESPONSE_FORMAT: string = "format";
    private static readonly PARAM_MAX_RESULTS: string = "h";
    private static readonly PARAM_FIRST_ID: string = "f";
    private static readonly PARAM_MAX_COMPLETIONS: string = "c";
    
    private static readonly MAX_RESULTS: number = 1000;
    private static readonly MAX_COMPLETIONS: number = 1000;
    private static readonly RESULTS_PAGE_SIZE: number = QueryUrlBuilder.MAX_RESULTS;
    
    private url: URL;
    
    constructor(apiUrl: string, endpoint: Endpoint) {
        this.url = new URL(endpoint, apiUrl);
        this.setInitialParams();
    }
    
    setInitialParams(): void {
        this.setResponseFormat(ResponseFormat.json);
        this.setMaxResults(QueryUrlBuilder.RESULTS_PAGE_SIZE);
        this.setResultsPageId(0);
        this.setMaxCompletions(0);
    }
    
    getUrlString(): string {
        return this.url.toString();
    }
    
    setQueryString(queryString: string): void {
        this.setParam(QueryUrlBuilder.PARAM_QUERY_STRING, queryString);
    }
    
    setResponseFormat(responseFormat: ResponseFormat): void {
        this.setParam(QueryUrlBuilder.PARAM_RESPONSE_FORMAT, responseFormat);
    }
    
    setMaxResults(maxResults: number): void {
        this.validateParamRange(maxResults, 0, QueryUrlBuilder.MAX_RESULTS, "maxResults");
        this.setParam(QueryUrlBuilder.PARAM_MAX_RESULTS, maxResults.toString());
    }
    
    setFirstId(firstId: number): void {
        this.validateParamMin(firstId, 0, "firstId");
        this.setParam(QueryUrlBuilder.PARAM_FIRST_ID, firstId.toString());
    }
    
    setMaxCompletions(maxCompletions: number): void {
        this.validateParamRange(maxCompletions, 0, QueryUrlBuilder.MAX_COMPLETIONS, "maxCompletions");
        this.setParam(QueryUrlBuilder.PARAM_MAX_COMPLETIONS, maxCompletions.toString());
    }
    
    setResultsPageId(pageId: number): void {
        this.setFirstId(pageId * QueryUrlBuilder.RESULTS_PAGE_SIZE);
    }
    
    getPageSize(): number {
        return QueryUrlBuilder.RESULTS_PAGE_SIZE;
    }
    
    private setParam(paramName: string, paramValue: string): void {
        this.url.searchParams.set(paramName, paramValue);
    }
    
    private validateParamRange(value: number, minValue: number, maxValue: number, paramName: string): void {
        if (value < minValue || value > maxValue) {
            throw new Error(`Param "${paramName}" is out of range. Valid range: <${minValue}, ${maxValue}>.`);
        }
    }
    
    private validateParamMin(value: number, minValue: number, paramName: string): void {
        if (value < minValue) {
            throw new Error(`Param "${paramName}" is out of range. The minimum value is ${minValue}.`);
        }
    }
    
}
