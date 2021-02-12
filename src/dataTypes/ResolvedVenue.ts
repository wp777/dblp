import { ResolvedPublication } from "./ResolvedPublication";
import { SimpleAuthor } from "./SimpleAuthor";
import { Venue } from "./Venue";

export interface ResolvedVenue {
    authors: SimpleAuthor[];
    publications: ResolvedPublication[];
    venue: Venue;
}
