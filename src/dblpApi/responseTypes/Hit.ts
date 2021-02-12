export interface Hit<T> {
    "@id": string;
    "@score": string;
    info: T;
    url: string;
}
