import { Author } from "./Author";
import { ResolvedPublication } from "./ResolvedPublication";

export interface ResolvedAuthor extends Author {
    publications: ResolvedPublication[];
}
