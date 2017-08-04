export interface IKeyValueStoreGet {
    get: <T>(key: string) => T;
}

export interface IKeyValueStoreSet {
    set: <T>(key: string, value: T) => void;
}

export class KeyValueStore implements IKeyValueStoreGet, IKeyValueStoreSet {

    get: <T>(key: string) => T;
    set: <T>(key: string, value: T) => void;

    data: any = {};

    constructor() {
        this.get = <T>(key: string) =>
            this.data[key] as T;

        this.set = <T>(key: string, value: T) =>    
            this.data[key] = value;
    }
}