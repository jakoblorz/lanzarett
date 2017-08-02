import { IContractServerResponse } from "./ContractServerResponse";
import { EndpointContractRoleType } from "../Contract/EndpointContract";

export type ContractServerRequestResponseFunction = (response: IContractServerResponse) => Promise<void>;

export interface IContractServerRequestArgument {
    key: string;
    value: any;
}

export interface IContractServerRequest {
    arguments: IContractServerRequestArgument[];
    send: ContractServerRequestResponseFunction;
    rpc: string | undefined;
    role: EndpointContractRoleType;
}

export class ContractServerRequest implements IContractServerRequest {

    arguments: IContractServerRequestArgument[];
    send: ContractServerRequestResponseFunction;
    rpc: string;
    role: EndpointContractRoleType;

    constructor(role: EndpointContractRoleType, rpc: string, args: IContractServerRequestArgument[], callback: ContractServerRequestResponseFunction) {
        this.arguments = args;
        this.send = callback;
        this.role = role;
        this.rpc = rpc;
    }

}