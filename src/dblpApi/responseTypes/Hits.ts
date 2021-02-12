import { Hit } from "./Hit";

export interface Hits<T> {
    "@computed": string;
    "@first": string;
    "@sent": string;
    "@total": string;
    hit?: Hit<T>[];
}
