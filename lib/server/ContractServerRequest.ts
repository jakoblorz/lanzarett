import { IContractServerResponse } from "./ContractServerResponse";
import { EndpointContractRoleType } from "../contract/EndpointContract";

export type ContractServerResponseFunctionType = (response: IContractServerResponse) => Promise<void>;

/**
 * arguments from the request should be stored as
 * key-value pairs
 */
export interface IContractServerRequestArgument {
    key: string;
    value: any;
}

/**
 * incomming requests should be standardised using this
 * interface
 */
export interface IContractServerRequest {

    /**
     * store all arguments that were sent with the request
     */
    arguments: IContractServerRequestArgument[];

    /**
     * callback function to respond to the client
     */
    send: ContractServerResponseFunctionType;

    /**
     * signal request type as role
     */
    role: EndpointContractRoleType;
}

/**
 * simple implementation of the IContractServerRequest interface
 */
export class ContractServerRequest implements IContractServerRequest {

    arguments: IContractServerRequestArgument[];
    send: ContractServerResponseFunctionType;
    role: EndpointContractRoleType;

    constructor(role: EndpointContractRoleType, args: IContractServerRequestArgument[], callback: ContractServerResponseFunctionType) {
        this.arguments = args;
        this.send = callback;
        this.role = role;
    }

}