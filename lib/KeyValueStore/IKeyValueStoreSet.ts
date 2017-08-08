export interface IKeyValueStoreSet {
    set: <T>(key: string, value: T) => void;
}