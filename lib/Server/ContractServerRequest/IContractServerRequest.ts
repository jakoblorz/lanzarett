import { IContractServerRequestArgument } from "./IContractServerRequestArgument";
import { EndpointContractRoleType } from "../../Contracts/EndpointContract/EndpointContractRoleType";

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
     * signal request type as role
     */
    role: EndpointContractRoleType;
}