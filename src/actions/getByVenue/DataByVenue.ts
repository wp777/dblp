import * as dataTypes from "../../dataTypes";

export interface DataByVenue {
    [venueKey: string]: dataTypes.ResolvedVenue;
}
