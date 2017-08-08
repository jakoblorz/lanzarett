import { IKeyValueStoreGet } from "../../KeyValueStore/IKeyValueStoreGet";
export type EndpointContractFunction = (kvs: IKeyValueStoreGet, ...args: any[]) => Promise<any>;