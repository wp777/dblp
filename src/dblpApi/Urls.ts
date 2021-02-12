export class Urls {
    
    static extractAuthorPidFromAuthorUrl(authorUrl: string): string {
        const separator = "/pid/";
        if (!authorUrl.includes(separator)) {
            throw new Error(`Could not extract author pid from author url: "${authorUrl}".`);
        }
        return authorUrl.split(separator)[1];
    }
    
    static extractVenueKeyFromVenueUrl(venueUrl: string): string {
        const separator = "/db/";
        if (!venueUrl.includes(separator)) {
            throw new Error(`Could not extract venue key from venue url: "${venueUrl}".`);
        }
        return venueUrl.split(separator)[1];
    }
    
    static extractVenueKeyFromPublicationUrl(publicationUrl: string): string {
        const separator = "/rec/";
        if (!publicationUrl.includes(separator)) {
            throw new Error(`Could not extract venue key from publication url: "${publicationUrl}".`);
        }
        const parts = publicationUrl.split(separator)[1].split("/");
        return parts[0] + "/" + parts[1] + "/";
    }
    
}
