import { IContractServerResponse } from "../ContractServerResponse/ContractServerResponse";
import { EndpointContractRoleType } from "../../Contracts/EndpointContract/EndpointContractRoleType";
import { IContractServerRequest } from "./IContractServerRequest";
import { IContractServerRequestArgument } from "./IContractServerRequestArgument";
/**
 * simple implementation of the IContractServerRequest interface
 */
export class ContractServerRequest implements IContractServerRequest {

    arguments: IContractServerRequestArgument[];
    role: EndpointContractRoleType;

    constructor(role: EndpointContractRoleType, args: IContractServerRequestArgument[]) {
        this.arguments = args;
        this.role = role;
    }

}