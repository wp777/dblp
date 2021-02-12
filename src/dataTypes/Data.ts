import { Authors } from "./Authors";
import { SimpleAuthors } from "./SimpleAuthors";
import { Publications } from "./Publications";
import { Venues } from "./Venues";

export interface Data {
    authors: Authors;
    externalAuthors: SimpleAuthors;
    publications: Publications;
    venues: Venues;
}
