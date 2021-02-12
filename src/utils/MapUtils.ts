export class MapUtils {
    
    static convertArrayToMap<T>(arr: T[], mapKeyExtractor: (obj: T) => string): { [id: string]: T } {
        const map: { [id: string]: T } = {};
        for (let obj of arr) {
            const key = mapKeyExtractor(obj);
            if (key in map) {
                throw new Error(`Error while converting array to map: key "${key}" already exists.`)
            }
            map[key] = obj;
        }
        return map;
    }
    
    static convertArrayToMapOfArrays<T>(arr: T[], mapKeyExtractor: (obj: T) => string): { [id: string]: T[] } {
        const map: { [id: string]: T[] } = {};
        for (let obj of arr) {
            const key = mapKeyExtractor(obj);
            if (key in map) {
                map[key].push(obj);
            }
            else {
                map[key] = [obj];
            }
        }
        return map;
    }
    
    static mapObjectsInMap<TSource, TDestination>(sourceObj: { [key: string]: TSource }, mapper: (obj: TSource) => TDestination): { [key: string]: TDestination } {
        const destinationObj: { [key: string]: TDestination } = {};
        for (let k in sourceObj) {
            destinationObj[k] = mapper(sourceObj[k]);
        }
        return destinationObj;
    }
    
}
