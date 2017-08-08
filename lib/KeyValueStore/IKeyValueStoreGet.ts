export interface IKeyValueStoreGet {
    get: <T>(key: string) => T;
}