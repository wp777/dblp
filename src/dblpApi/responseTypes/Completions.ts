import { Completion } from "./Completion";

export interface Completions {
    "@computed": string;
    "@sent": string;
    "@total": string;
    c?: Completion | Completion[];
}
