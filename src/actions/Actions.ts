import { ActionName } from "./ActionName";
import { Action } from "./Action";
import * as cache from "../cache";
import * as configuration from "../configuration";
import * as fetch from "./fetch";
import * as getAllData from "./getAllData";
import * as getByAuthor from "./getByAuthor";
import * as getByPublication from "./getByPublication";
import * as getByVenue from "./getByVenue";
import * as utils from "../utils";

export class Actions {
    
    static getActionNameFromString(actionStr: string | null): ActionName {
        for (let actionId of utils.EnumUtils.getKeys(ActionName)) {
            const actionName = ActionName[actionId];
            if (actionStr === actionName) {
                return ActionName[actionId];
            }
        }
        throw new Error(`Unknown action: "${actionStr}".`)
    }
    
    static getAction(actionName: ActionName, cache: cache.Cache, configuration: configuration.Configuration): Action {
        switch (actionName) {
            case ActionName.FETCH: {
                return new fetch.FetchAction(cache, configuration);
            }
            case ActionName.GET_ALL_DATA: {
                return new getAllData.GetAllDataAction(cache, configuration);

            }
            case ActionName.GET_BY_AUTHOR: {
                return new getByAuthor.GetByAuthorAction(cache, configuration);

            }
            case ActionName.GET_BY_PUBLICATION: {
                return new getByPublication.GetByPublicationAction(cache, configuration);

            }
            case ActionName.GET_BY_VENUE: {
                return new getByVenue.GetByVenueAction(cache, configuration);

            }
        }
    }
    
}
