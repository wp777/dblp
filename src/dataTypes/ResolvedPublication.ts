import { Publication } from "./Publication";
import { SimpleAuthor } from "./SimpleAuthor";
import { Venue } from "./Venue";

export interface ResolvedPublication extends Omit<Publication, "authorPids" | "venueAcronym"> {
    authors: SimpleAuthor[];
    venue: Venue | string;
}
