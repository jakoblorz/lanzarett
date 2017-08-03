import { IContractServerResponse } from "./ContractServerResponse";
import { EndpointContractRoleType } from "../contract/EndpointContract";

export type ContractServerResponseFunctionType = (response: IContractServerResponse) => Promise<void>;

export interface IContractServerRequestArgument {
    key: string;
    value: any;
}

export interface IContractServerRequest {
    arguments: IContractServerRequestArgument[];
    send: ContractServerResponseFunctionType;
    rpc: string | undefined;
    role: EndpointContractRoleType;
}

export class ContractServerRequest implements IContractServerRequest {

    arguments: IContractServerRequestArgument[];
    send: ContractServerResponseFunctionType;
    rpc: string;
    role: EndpointContractRoleType;

    constructor(role: EndpointContractRoleType, rpc: string, args: IContractServerRequestArgument[], callback: ContractServerResponseFunctionType) {
        this.arguments = args;
        this.send = callback;
        this.role = role;
        this.rpc = rpc;
    }

}