import { IContractServerRequestArgument } from "../Server/ContractServerRequest/IContractServerRequestArgument";
import { IKeyValueStoreGet } from "./IKeyValueStoreGet";
import { IKeyValueStoreSet } from "./IKeyValueStoreSet";
import { IKeyValueStore } from "./IKeyValueStore";

export class KeyValueStore implements IKeyValueStoreGet, IKeyValueStoreSet, IKeyValueStore, IContractServerRequestArgument {
    
    key: string = "_internal_kvs";
    value: any = "{}";

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