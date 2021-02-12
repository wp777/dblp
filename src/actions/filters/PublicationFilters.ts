import * as dataTypes from "../../dataTypes";
import * as configuration from "../../configuration";
import * as utils from "../../utils";

export class PublicationFilters {
    
    static applyFiltersFromConfiguration(publications: dataTypes.Publications, configuration: configuration.Configuration): void {
        this.filterPublicationsByExcludedTypes(publications, configuration.excludePublicationTypes);
        this.filterPublicationsByYears(publications, configuration.years);
    }
    
    private static filterPublicationsByExcludedTypes(publications: dataTypes.Publications, excludedPublicationTypes: string[]): void {
        if (excludedPublicationTypes.length == 0) {
            return;
        }
        for (let key in publications) {
            const publication = publications[key];
            if (excludedPublicationTypes.includes(publication.type)) {
                delete publications[key];
            }
        }
    }
    
    private static filterPublicationsByYears(publications: dataTypes.Publications, yearsFilterConfig: number[] | { from: number, to: number } | null): void {
        if (!yearsFilterConfig) {
            return;
        }
        const years = this.resolveYearsFilterConfig(yearsFilterConfig);
        for (let key in publications) {
            const publication = publications[key];
            const year = parseInt(publication.year);
            if (!years.includes(year)) {
                delete publications[key];
            }
        }
    }
    
    private static resolveYearsFilterConfig(yearsFilterConfig: number[] | { from: number, to: number }): number[] {
        if (Array.isArray(yearsFilterConfig)) {
            return yearsFilterConfig;
        }
        else {
            return utils.NumberUtils.createNumbersRange(yearsFilterConfig.from, yearsFilterConfig.to);
        }
    }
    
}
