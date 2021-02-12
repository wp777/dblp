import { Configuration } from "./Configuration";

export const defaultConfiguration: Configuration = {
    apiUrl: "https://dblp.uni-trier.de",
    authors: [
        "Wojciech Jamroga",
        "Wojciech Penczek",
        "Damian Kurpiewski",
    ],
    cacheKey: "default",
    years: null,
    excludePublicationTypes: [],
};
