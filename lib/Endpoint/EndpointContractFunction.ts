import { IKeyValueStoreGet } from "../";
export type EndpointContractFunction = (kvs: IKeyValueStoreGet, ...args: any[]) => Promise<any>;