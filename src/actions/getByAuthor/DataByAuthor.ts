import * as dataTypes from "../../dataTypes";

export interface DataByAuthor {
    [authorPid: string]: dataTypes.ResolvedAuthor;
}
