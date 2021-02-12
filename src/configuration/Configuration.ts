export interface Configuration {
    apiUrl: string;
    authors: string[];
    cacheKey: string;
    years: number[] | { from: number, to: number } | null, // Ignored by fetch action
    excludePublicationTypes: string[], // Ignored by fetch action
}
