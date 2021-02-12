import { AuthorsReferences } from "./AuthorsReferences";

export interface Publication {
    authors: AuthorsReferences;
    doi: string;
    ee: string;
    key: string;
    pages: string;
    title: string;
    type: string;
    url: string;
    venue: [string, string];
    year: string;
}
