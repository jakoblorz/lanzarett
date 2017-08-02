import { IContractServerResponse } from "./ContractServerResponse";
import { EndpointContractRoleType } from "../Contract/EndpointContract";

export type ContractServerRequestResponseFunction = (response: IContractServerResponse) => Promise<void>;

export interface IContractServerRequestArgument {
    key: string;
    value: any;
}

export interface IContractServerRequest {
    arguments: IContractServerRequestArgument[];
    respond: ContractServerRequestResponseFunction;
    rpccode: string;
    role: EndpointContractRoleType;
}

export class ContractServerRequest implements IContractServerRequest {

    arguments: IContractServerRequestArgument[];
    respond: ContractServerRequestResponseFunction;
    rpccode: string;
    role: EndpointContractRoleType;

    constructor(role: EndpointContractRoleType, rpccode: string, args: IContractServerRequestArgument[], callback: ContractServerRequestResponseFunction) {
        this.arguments = args;
        this.respond = callback;
        this.role = role;
        this.rpccode = rpccode;
    }

}