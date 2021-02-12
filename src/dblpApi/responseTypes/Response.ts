import { ResponsePrimaryObject } from "./ResponsePrimaryObject";
import { Result } from "./Result";

export interface Response<T extends ResponsePrimaryObject> {
    result: Result<T>;
}
