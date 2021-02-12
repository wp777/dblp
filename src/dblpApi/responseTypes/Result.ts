import { Completions } from "./Completions";
import { Hits } from "./Hits";
import { Status } from "./Status";
import { Time } from "./Time";

export interface Result<T> {
    completions: Completions;
    hits: Hits<T>;
    query: string;
    status: Status;
    time: Time;
}
